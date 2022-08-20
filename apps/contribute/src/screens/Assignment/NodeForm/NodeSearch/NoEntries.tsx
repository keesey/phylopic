import { Nomen, UUID } from "@phylopic/utils"
import { FC } from "react"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserVerification from "../../../../ui/UserVerification"
import ParentSelector from "./ParentSelector"
export type Props = {
    name: Nomen
    onCancel: () => void
    onComplete: (uuid: UUID) => void
    onParentRequest: () => void
    parentRequested: boolean | null
}
const NoEntries: FC<Props> = ({ name, onCancel, onComplete, onParentRequest, parentRequested }) => {
    return (
        <>
            <Speech mode="system">
                <p>
                    Huh. &ldquo;
                    <NameView value={name} />
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
            {parentRequested && <ParentSelector childName={name} onComplete={onComplete} />}
        </>
    )
}
export default NoEntries
