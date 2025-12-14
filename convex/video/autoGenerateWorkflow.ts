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
      const updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: args.userId,
      })

      // Process ALL scenes IN PARALLEL
      const sceneResults = await Promise.all(
        updatedVideoAfterCharactersGenerated.scenes.map(async (scene, sceneIndex) => {
          console.log('Generating scene image:', sceneIndex);
          // Audio + Image in parallel
          const [audioResult, imageResult] = await Promise.all([
            !scene.audioUrl && scene.narration
              ? (
                console.log('Generating audio for scene:', sceneIndex),
                step.runAction(internal.video.generateAudio.internalGenerateAudio, {
                  text: scene.narration,
                  voiceId: video.voice.voiceId,
                  videoId: args.videoId,
                  sceneIndex: sceneIndex,
                  userId: args.userId,
                })
              ) : (
                console.log('Skipping audio generation for scene:', sceneIndex),
                null
              ),

            !scene.imageUrl
              ? (
                console.log('Generating image for scene:', sceneIndex),
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
              ) : (
                console.log('Skipping image generation for scene:', sceneIndex),
                null
              ),
          ]);

          console.log('audioResult:', audioResult)
          console.log('imageResult:', imageResult)

          const updatedVideoAfterScenesAudioImagesGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
            id: args.videoId,
            userId: args.userId,
          })


          if (
            !updatedVideoAfterScenesAudioImagesGenerated.scenes[sceneIndex].imageUrl ||
            !updatedVideoAfterScenesAudioImagesGenerated.scenes[sceneIndex].audioUrl
          ) {
            console.error("Scene audio/image generation failed", { sceneIndex });

            await step.runMutation(internal.video.video.updateInternalVideo, {
              id: args.videoId,
              userId: args.userId,
              update: {
                autoGenerate: false,
              },
            });

            return null; // ✅ NEVER throw
          }


          if (updatedVideoAfterScenesAudioImagesGenerated.scenes[sceneIndex].videoUrl) {
            console.log('Skipping video generation for scene:', sceneIndex);
            return scene;
          }

          const videoResult = await step.runAction(internal.video.generateVideo.internalGenerateSceneVideo, {
            prompt: scene.videoPrompt,
            baseImageUrl: updatedVideoAfterScenesAudioImagesGenerated.scenes[sceneIndex].imageUrl,
            videoId: args.videoId,
            sceneIndex: sceneIndex,
            userId: args.userId,
          });

          return scene;
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
  const characterImageIds = [];
  const missingCharacters = [];
  const charactersWithoutImages = [];

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
