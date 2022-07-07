import { FC } from "react"
import Pending from "./Pending"
import Published from "./Published"
const Submissions: FC = () => {
    return (
        <>
            <section>
                <h2>Pending Submissions</h2>
                <Pending />
            </section>
            <section>
                <h2>Published Submissions</h2>
                <Published />
            </section>
        </>
    )
}
export default Submissions
