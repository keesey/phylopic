import { GAMES } from "~/games/GAMES"
const Title = async ({ params: paramsPromise }: { params: Promise<{ code: string }> }) => {
    const params = await paramsPromise
    return <>{GAMES[params.code]?.title}</>
}
export default Title
