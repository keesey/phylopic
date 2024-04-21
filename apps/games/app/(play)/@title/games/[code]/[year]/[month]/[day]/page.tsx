import { GAMES } from "~/games/GAMES"
const Title = ({ params }: { params: { code: string } }) => {
    return <>{GAMES[params.code]?.title}</>
}
export default Title
