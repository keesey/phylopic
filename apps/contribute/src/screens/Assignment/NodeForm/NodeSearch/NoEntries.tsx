import { Identifier, UUID } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import Speech from "~/ui/Speech"
import UserVerification from "~/ui/UserVerification"
import NameRenderer from "../NameRenderer"
import ParentSelector from "./ParentSelector"
export type Props = {
    nameText: string
    onCancel: () => void
    onComplete: (identifier: Identifier, newTaxonName?: string) => void
    onParentRequest: () => void
    parentRequested: boolean | null
}
const NoEntries: FC<Props> = ({ nameText, onCancel, onComplete, onParentRequest, parentRequested }) => {
    const childName = useMemo(() => parseNomen(nameText), [nameText])
    return (
        <>
            <Speech mode="system">
                <p>
                    Huh. &ldquo;
                    <NameRenderer value={nameText} />
                    &rdquo;. I have never heard of that. Are you sure you spelled it right?
                </p>
            </Speech>
            <UserVerification
                affirmed={parentRequested}
                affirmation={<>Oh, I&rsquo;m sure.</>}
                denial={<>Actually &hellip; maybe not?</>}
                onAffirm={onParentRequest}
                onDeny={onCancel}
            />
            {parentRequested && <ParentSelector childName={childName} onComplete={onComplete} />}
        </>
    )
}
export default NoEntries
