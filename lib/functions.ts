import { Doc } from "@/convex/_generated/dataModel";

export const calculateTotalCreditsRequired = (video: Doc<'videos'>) => {
  let totalRequiredCredits = 0

  const creditsRequiredForEachVideoGeneration = video?.videoGenerationModel?.category === 'premium' ? 10 : 5

  totalRequiredCredits += video.characters.reduce((sum: number, character: any) => {
    return !character.imageUrl ? sum + 5 : sum;
  }, 0);

  totalRequiredCredits += video.scenes.reduce((sum: number, scene: any) => {
    if (!scene.imageUrl) sum += 5;
    if (!scene.videoUrl) sum += creditsRequiredForEachVideoGeneration;
    if (!scene.audioUrl) sum += 5;
    return sum;
  }, 0)

  return totalRequiredCredits
}
