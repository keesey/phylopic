"use server"

import { generate } from "./generate"

export const generatePracticeGame = async (code: string) => {
    return await generate(code)
}
