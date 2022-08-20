import { Nomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import NameForm from "../../NameForm"
import ParentSearch from "./ParentSearch"
export type Props = {
    childName: Nomen
    onComplete: (uuid: UUID) => void
}
export const ParentSelector: FC<Props> = ({ childName, onComplete }) => {
    const [name, setName] = useState<Nomen | null>(null)
    return (
        <>
            <Speech mode="system">
                <p>
                    Okay, just checking. Can I get the name of a larger group that <NameView value={childName} /> is
                    part of?
                </p>
            </Speech>
            <NameForm onSubmit={setName} placeholder="More general group" />
            {name && <ParentSearch childName={childName} name={name} onComplete={onComplete} />}
        </>
    )
}
export default ParentSelector
