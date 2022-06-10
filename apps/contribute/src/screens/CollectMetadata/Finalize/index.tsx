import { UUID } from "@phylopic/utils"
import { FC } from "react"
import { WorkingSubmission } from "../WorkingSubmission"
interface Props {
    submission: WorkingSubmission
    onComplete?: () => void
    uuid: UUID
}
const Finalize: FC<Props> = ({ onComplete }) => {
    return (
        <section id="finalize">
            <p>:TODO:</p>
        </section>
    )
}
export default Finalize
