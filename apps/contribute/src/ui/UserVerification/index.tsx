import { FC, ReactNode, useCallback, useState } from "react"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import { ICON_CHECK, ICON_X } from "../ICON_SYMBOLS"
export type Props = {
    affirmed: boolean | null
    affirmation: ReactNode
    denial: ReactNode
    onAffirm: () => void
    onDeny: () => void
}
const UserVerification: FC<Props> = ({ affirmed, affirmation, denial, onAffirm, onDeny }) => {
    const respond = useCallback(
        (value: boolean) => {
            value ? onAffirm() : onDeny()
        },
        [onAffirm, onDeny],
    )
    if (affirmed === null) {
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
            <p>{affirmed ? affirmation : denial}</p>
        </Speech>
    )
}
export default UserVerification
