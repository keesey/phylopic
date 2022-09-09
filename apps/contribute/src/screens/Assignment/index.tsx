import { Hash } from "@phylopic/utils"
import { FC } from "react"
import AssignmentContainer from "./AssignmentContainer"
import Content from "./Content"
export type Props = {
    hash: Hash
}
const Assignment: FC<Props> = ({ hash }) => {
    return (
        <AssignmentContainer
            initialState={{ changeRequested: false, hash, parentRequested: false, pending: false, text: "" }}
        >
            <Content />
        </AssignmentContainer>
    )
}
export default Assignment
