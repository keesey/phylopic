"use client"
import { GameInstance } from "~/lib/s3/GameInstance"
const AUTHOR_STORAGE_KEY = "phylopic_games_author"
const getAuthor = (): GameInstance<unknown>["meta"]["author"] => {
    const json = localStorage.getItem(AUTHOR_STORAGE_KEY)
    if (json) {
        try {
            const parsed = JSON.parse(json)
            if (typeof parsed?.name === "string" && ["string", "undefined"].includes(typeof parsed.href)) {
                return parsed.href ? { href: parsed.href, name: parsed.name } : { name: parsed.name }
            }
        } catch {
            // Malformed.
        }
    }
    const name = prompt("What’s your name?") ?? "Anonymous"
    const href = prompt("What’s your website’s URL?") ?? undefined
    const author = href ? { href, name } : { name }
    localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(author))
    return author
}
const getContent = async <TContent = unknown>(code: string) => {
    const generator = await import(`~/games/${code}/generate`).then(mod => mod.default as () => Promise<TContent>)
    return await generator()
}
export const generate = async <TContent = unknown>(code: string): Promise<GameInstance<TContent>> => {
    const author = getAuthor()
    const content = await getContent<TContent>(code)
    return {
        content,
        meta: { author },
    }
}
