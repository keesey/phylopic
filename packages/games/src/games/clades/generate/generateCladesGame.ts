import { CladesGame } from "./CladesGame"
import { getAnswers } from "./getAnswers"
export async function generateCladesGame(
    build: number,
    minDepth = 8,
    numSets = 4,
    imagesPerSet = 4,
): Promise<CladesGame> {
    const answers = await getAnswers(build, minDepth, numSets, imagesPerSet)
    return { answers }
}
