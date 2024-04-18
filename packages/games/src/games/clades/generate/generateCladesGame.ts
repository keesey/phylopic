import { CladesGame } from "./CladesGame"
import { getAnswers } from "./getAnswers"
export async function generateCladesGame(
    build: number,
    minDepth = 8,
    numSets = 4,
    imagesPerClade = 4,
): Promise<CladesGame> {
    const answers = await getAnswers(build, minDepth, numSets, imagesPerClade)
    return { answers }
}
