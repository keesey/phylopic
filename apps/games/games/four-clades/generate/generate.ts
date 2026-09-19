import { Game } from "../models"
import { generateAnswers } from "./generateAnswers"
export async function generate(
    build: number,
    minDepth: number,
    numAnswers: number,
    imagesPerAnswer: number,
): Promise<Game> {
    const answers = await generateAnswers(build, minDepth, numAnswers, imagesPerAnswer)
    return { answers }
}
