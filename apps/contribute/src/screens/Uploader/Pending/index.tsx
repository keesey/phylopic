import { FC } from "react"
import Loader from "~/ui/Loader"
const Pending: FC = () => {
    return (
        <section>
            <p>Cool, give me a moment to process that&hellip;</p>
            <Loader />
        </section>
    )
}
export default Pending
