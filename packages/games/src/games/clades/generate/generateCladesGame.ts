import { CladesGame } from "./CladesGame"
import { getAnswers } from "./getAnswers"
export async function generateCladesGame(
    build: number,
    minDepth: number,
    numAnswers: number,
    imagesPerAnswer: number,
): Promise<CladesGame> {
    const answers = await getAnswers(build, minDepth, numAnswers, imagesPerAnswer)
    return { answers }
}
