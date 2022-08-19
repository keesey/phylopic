import { FC, ReactNode, useCallback, useState } from "react"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import { ICON_CHECK, ICON_X } from "../ICON_SYMBOLS"
export type Props = {
    affirmation: ReactNode
    denial: ReactNode
    onAffirm: () => void
    onDeny: () => void
}
const UserVerification: FC<Props> = ({ affirmation, denial, onAffirm, onDeny }) => {
    const [result, setResult] = useState<boolean | null>(null)
    const respond = useCallback(
        (value: boolean) => {
            setResult(value)
            value ? onAffirm() : onDeny()
        },
        [onAffirm, onDeny],
    )
    if (result === null) {
        return (
            <UserOptions>
                <UserButton icon={ICON_CHECK} onClick={() => respond(true)}>
                    {affirmation}
                </UserButton>
                <UserButton danger icon={ICON_X} onClick={() => respond(false)}>
                    {denial}
                </UserButton>
            </UserOptions>
        )
    }
    return (
        <Speech mode="user">
            <p>{result ? affirmation : denial}</p>
        </Speech>
    )
}
export default UserVerification
