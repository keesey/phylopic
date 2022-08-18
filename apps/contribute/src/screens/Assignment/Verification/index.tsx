import { FC, ReactNode, useCallback, useState } from "react"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    affirmation: ReactNode
    denial: ReactNode
    onAffirm: () => void
    onDeny: () => void
}
const Verification: FC<Props> = ({ affirmation, denial, onAffirm, onDeny }) => {
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
                <UserButton onClick={() => respond(true)}>{affirmation}</UserButton>
                <UserButton danger onClick={() => respond(false)}>
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
export default Verification
