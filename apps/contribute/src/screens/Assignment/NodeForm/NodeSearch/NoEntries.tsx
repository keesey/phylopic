import { Nomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import ParentSelector from "./ParentSelector"
import UserVerification from "../../../../ui/UserVerification"
export type Props = {
    name: Nomen
    onCancel: () => void
    onComplete: (uuid: UUID) => void
}
const NoEntries: FC<Props> = ({ name, onCancel, onComplete }) => {
    const [parentRequested, setParentRequested] = useState(false)
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
                affirmation={<>Oh, I&rsquo;m sure.</>}
                denial={<>Actually &hellip; maybe not?</>}
                onAffirm={() => setParentRequested(true)}
                onDeny={onCancel}
            />
            {parentRequested && <ParentSelector childName={name} onComplete={onComplete} />}
        </>
    )
}
export default NoEntries
