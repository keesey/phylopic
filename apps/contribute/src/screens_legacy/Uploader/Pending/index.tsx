import { Loader } from "@phylopic/ui"
import { FC } from "react"
const Pending: FC = () => {
    return (
        <section>
            <p>Cool, give me a moment to process that&hellip;</p>
            <Loader />
        </section>
    )
}
export default Pending
