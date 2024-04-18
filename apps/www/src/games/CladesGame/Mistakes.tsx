import { CladesBoardContext } from "@phylopic/games"
import { useContext } from "react"
const Mistakes = () => {
    const [state] = useContext(CladesBoardContext) ?? []
    const mistakes = state?.mistakes ?? 0
    return <section>Mistakes remaining: {4 - mistakes}</section>
}
export default Mistakes
