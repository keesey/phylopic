import { Identifier, Nomen, stringifyNomen } from "@phylopic/utils"
import { FC, useCallback } from "react"
import { ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    name: Nomen
    onComplete: (identifier: Identifier, newTaxonName?: string) => void
    parentIdentifier: Identifier
}
const NewNodeCreator: FC<Props> = ({ name, onComplete, parentIdentifier }) => {
    const complete = useCallback(() => {
        onComplete(parentIdentifier, stringifyNomen(name))
    }, [name, onComplete, parentIdentifier])
    return (
        <>
            <Speech mode="system">
                <p>Nice! We don&rsquo;t have that yet.</p>
            </Speech>
            <UserOptions>
                <UserButton icon={ICON_PLUS} onClick={complete}>
                    Add it.
                </UserButton>
            </UserOptions>
        </>
    )
}
export default NewNodeCreator
