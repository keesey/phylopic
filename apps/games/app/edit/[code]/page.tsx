import { Metadata } from "next"
import { notFound } from "next/navigation"
import { GAMES } from "~/games/GAMES"
export type Params = { code: string }
export const generateMetadata = async ({ params: paramsPromise }: { params: Promise<Params> }): Promise<Metadata> => {
    const params = await paramsPromise
    const game = GAMES[params.code]
    return {
        title: `${game ? `${game.title} | ` : ""}PhyloPic Games Editor`,
        robots: {
            index: false,
            follow: false,
        },
    }
}
const EditGamePage = async ({ params: paramsPromise }: { params: Promise<Params> }) => {
    const params = await paramsPromise
    const game = GAMES[params.code]
    if (!game) {
        notFound()
    }
    return <p>Select a date to get started.</p>
}
export default EditGamePage
