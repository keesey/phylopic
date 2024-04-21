"use client"
import { GameInstance } from "~/lib/s3/GameInstance"
const AUTHOR_STORAGE_KEY = "phylopic_games_author"
const isAuthor = (x: unknown): x is GameInstance<unknown>["meta"]["author"] =>
    typeof (x as undefined | { name: unknown })?.name === "string" &&
    ["string", "undefined"].includes(typeof (x as undefined | { href: unknown })?.href)
export const getMeta = (): GameInstance<unknown>["meta"] => {
    const json = localStorage.getItem(AUTHOR_STORAGE_KEY)
    if (json) {
        try {
            const parsed = JSON.parse(json)
            if (isAuthor(parsed)) {
                return { author: parsed.href ? { href: parsed.href, name: parsed.name } : { name: parsed.name } }
            }
        } catch {
            // Malformed.
        }
    }
    const name = prompt("What’s your name?") ?? "Anonymous"
    const href = prompt("What’s your website’s URL?") ?? undefined
    const author = href ? { href, name } : { name }
    localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(author))
    return { author }
}
