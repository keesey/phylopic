import { CladesGame } from "./CladesGame"
import { getAnswers } from "./getAnswers"
export async function generateCladesGame(
    build: number,
    minDepth = 8,
    numSets = 4,
    imagesPerAnswer = 4,
): Promise<CladesGame> {
    const answers = await getAnswers(build, minDepth, numSets, imagesPerAnswer)
    return { answers }
}
