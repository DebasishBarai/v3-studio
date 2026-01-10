import { Infer, v } from "convex/values";
import { workflow } from "../index";
import { internal } from "../_generated/api";
import { characterSchema } from "../schema";

export const autoGenerateVideoWorkflow = workflow.define({
  args: {
    videoId: v.id("videos"),
    userId: v.id("users"),
  },
  handler: async (step, args) => {

    // Get video
    const video = await step.runQuery(internal.video.video.getInternalVideo, {
      id: args.videoId,
      userId: args.userId,
    });

    try {
      console.log('Auto Generating Workflow Started')

      // Generate ALL character images IN PARALLEL
      console.log('Generating character images...')

      await Promise.all(
        video.characters
          .map((character, index) => ({ character, index })) // preserve index
          .filter(({ character }) => !character.imageUrl)
          .map(({ character, index }) => {
            console.log('Generating character image:', character.name);
            return step.runAction(
              internal.video.generateVideoImage.internalGenerateCharacterImage,
              {
                prompt: character.imagePrompt,
                aspectRatio: video.aspectRatio,
                videoId: args.videoId,
                characterIndex: index, // ✅ original index
                userId: args.userId,
              }
            );
          })
      );

      // Re-fetch the video after character generation
      let updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: args.userId,
      })

      let allCharactersGenerated = updatedVideoAfterCharactersGenerated.characters.every((character) => character.imageUrl)

      // check whether all characters are generated and if not wait for them to be generated
      if (!allCharactersGenerated) {
        console.error('Not all characters generated, wait for them to be generated and retry after 10 seconds')
        await new Promise(resolve => setTimeout(resolve, 10000))

        // fetch the updated video again
        updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
          id: args.videoId,
          userId: args.userId,
        })

        allCharactersGenerated = updatedVideoAfterCharactersGenerated.characters.every((character) => character.imageUrl)

        // again if all the characters are not generated then re run the character generate workflow
        if (!allCharactersGenerated) {
          // Generate ALL character images IN PARALLEL for the second time
          console.log('Characters are not generated even after waiting for 10 seconds')
          console.log('Generating character images for the second time...')

          await Promise.all(
            updatedVideoAfterCharactersGenerated.characters
              .map((character, index) => ({ character, index })) // preserve index
              .filter(({ character }) => !character.imageUrl)
              .map(({ character, index }) => {
                console.log('Generating character image:', character.name);
                return step.runAction(
                  internal.video.generateVideoImage.internalGenerateCharacterImage,
                  {
                    prompt: character.imagePrompt,
                    aspectRatio: video.aspectRatio,
                    videoId: args.videoId,
                    characterIndex: index, // ✅ original index
                    userId: args.userId,
                  }
                );
              })
          );

          // Re-fetch the video after character generation
          updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
            id: args.videoId,
            userId: args.userId,
          })

          // check whether all characters are generated and if not wait for them to be generated
          allCharactersGenerated = updatedVideoAfterCharactersGenerated.characters.every((character) => character.imageUrl)

          // again if all the characters are not generated then aborting the auto generate workflow
          if (!allCharactersGenerated) {
            console.error('Not all characters generated even after running it for the second time. Hence aborting the auto generate workflow')

            await step.runMutation(internal.video.video.updateInternalVideo, {
              id: args.videoId,
              userId: args.userId,
              update: {
                autoGenerate: false,
                autoGenerateError: `Not all characters generated even after running it for the second time. Hence aborting the auto generate workflow`,
              },
            });

            return null; // ✅ NEVER throw
          } else {
            console.log('All characters generated in the second try')
          }
        } else {
          console.log('All characters generated after waiting for 10 seconds')
        }
      } else {
        console.log('All characters generated in the first try')
      }

      console.log('Starting scene generation workflow')

      // Generate audio + images for all scenes IN PARALLEL
      await Promise.all(
        updatedVideoAfterCharactersGenerated.scenes.map(async (scene, sceneIndex) => {

          const tasks: Promise<any>[] = [];
          console.log('Generating scene image:', sceneIndex);
          // Audio + Image in parallel
          if (!scene.audioUrl && scene.narration) {
            console.log('Generating audio for scene:', sceneIndex)
            tasks.push(
              step.runAction(internal.video.generateAudio.internalGenerateAudio, {
                text: scene.narration,
                voiceId: video.voice.voiceId,
                videoId: args.videoId,
                sceneIndex: sceneIndex,
                userId: args.userId,
              })
            )
          } else {
            console.log('Skipping audio generation for scene:', sceneIndex)
          }

          if (!scene.imageUrl) {
            console.log('Generating image for scene:', sceneIndex)
            tasks.push(
              step.runAction(internal.video.generateVideoImage.internalGenerateSceneImage, {
                prompt: scene.imagePrompt,
                aspectRatio: video.aspectRatio,
                characterImageIds: generateCharacterIds({
                  characters: updatedVideoAfterCharactersGenerated.characters,
                  characterNames: scene.charactersInTheScene ?? [],
                }),
                videoId: args.videoId,
                sceneIndex: sceneIndex,
                userId: args.userId,
              })
            )
          } else {
            console.log('Skipping image generation for scene:', sceneIndex)
          }

          await Promise.all(tasks);
        })
      )
      const videoAfterSceneAssets = await step.runQuery(
        internal.video.video.getInternalVideo,
        {
          id: args.videoId,
          userId: args.userId,
        }
      );

      // Generate scene videos in parallel
      await Promise.all(
        videoAfterSceneAssets.scenes.map(async (scene, sceneIndex) => {
          if (!scene.imageUrl) {
            console.error("Skipping video generation, missing image", { sceneIndex });
            return;
          }

          if (scene.videoUrl) {
            console.log(`Skipping video for scene ${sceneIndex}, already exists`);
            return;
          }

          await step.runAction(internal.video.generateVideo.internalGenerateSceneVideo, {
            prompt: scene.videoPrompt,
            baseImageUrl: scene.imageUrl,
            videoId: args.videoId,
            sceneIndex: sceneIndex,
            userId: args.userId,
          });
        })
      );

      // Mark autoGenerate = false at the END
      await step.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: args.userId,
        update: {
          autoGenerate: false,
        },
      });
      return null
    } catch (error) {
      console.error(error);
      // Mark autoGenerate = false at the END
      await step.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: args.userId,
        update: {
          autoGenerate: false,
          autoGenerateError: `${error}`,
        },
      });
      return null
    }
  }
});

const generateCharacterIds = ({
  characters,
  characterNames,
}: {
  characters: Infer<typeof characterSchema>[];
  characterNames: string[];
}) => {
  const characterImageIds: string[] = [];
  const missingCharacters: string[] = [];
  const charactersWithoutImages: string[] = [];

  for (const characterName of characterNames) {
    // Find the character in the video.characters array
    const character = characters.find(
      (char) => char.name === characterName
    );

    if (!character) {
      // Character doesn't exist in the video
      missingCharacters.push(characterName);
      continue;
    }

    if (!character.imageStorageId) {
      // Character exists but image hasn't been generated yet
      charactersWithoutImages.push(characterName);
      continue;
    }

    // Character exists and has an image
    characterImageIds.push(character.imageStorageId);

  }

  return characterImageIds;
};
