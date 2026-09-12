import Link from "next/link"
import { GAMES } from "~/games/GAMES"
import { CalendarDate } from "~/lib/datetime"
import { getGameInstance } from "~/lib/s3"
export interface Props {
    code: string
    date: CalendarDate
}
export const Attribution = async ({ code, date }: Props) => {
    if (!GAMES[code]) {
        return null
    }
    const gameInstance = await getGameInstance(code, date)
    if (!gameInstance) {
        return null
    }
    const author = gameInstance.meta.author
    return (
        <h4>
            Edited by{" "}
            {author.href ? (
                <Link href={author.href} target="_blank" rel="noreferrer">
                    {author.name}
                </Link>
            ) : (
                author.name
            )}
        </h4>
    )
}
