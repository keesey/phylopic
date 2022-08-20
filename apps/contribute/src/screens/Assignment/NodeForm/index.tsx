import { Nomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import UserScrollTo from "~/ui/UserScrollTo"
import NameForm from "./NameForm"
import NodeSearch from "./NodeSearch"
export type Props = {
    onComplete: (uuid: UUID) => void
}
const NodeForm: FC<Props> = ({ onComplete }) => {
    const [name, setName] = useState<Nomen | null>(null)
    return (
        <>
            <NameForm onSubmit={setName} placeholder="Species or other taxonomic group" />
            {name && <NodeSearch name={name} onCancel={() => setName(null)} onComplete={onComplete} />}
            <UserScrollTo />
        </>
    )
}
export default NodeForm
