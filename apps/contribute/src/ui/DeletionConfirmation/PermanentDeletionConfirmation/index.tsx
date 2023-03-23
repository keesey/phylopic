import { Loader } from "@phylopic/ui"
import React, { FC } from "react"
import { ICON_ARROW_CIRCLE, ICON_X } from "../../ICON_SYMBOLS"
import Speech from "../../Speech"
import UserButton from "../../UserButton"
import UserInput from "../../UserInput"
import UserOptions from "../../UserOptions"
import UserTextForm from "../../UserTextForm"
export type Props = {
    error?: Error
    isLoading?: boolean
    onCancel?: () => void
    onConfirm?: () => void
}
const CONFIRMATION_TEXT = "PERMANENTLY DELETE"
const PermanentDeletionConfirmation: FC<Props> = ({ error, isLoading, onCancel, onConfirm }) => {
    return (
        <>
            <Speech mode="system">
                <p>
                    Wow. O.K., if you&rsquo;re <strong>really sure</strong>, please type <em>{CONFIRMATION_TEXT}</em>{" "}
                    below.
                </p>
            </Speech>
            {!isLoading && !error && (
                <>
                    <UserTextForm
                        editable
                        value=""
                        onSubmit={value => {
                            if (value === CONFIRMATION_TEXT) {
                                onConfirm?.()
                            } else {
                                alert("That is not what I asked you to type.")
                            }
                        }}
                    >
                        {(value, setValue) => (
                            <UserInput
                                onChange={setValue}
                                placeholder={CONFIRMATION_TEXT}
                                required
                                showSubmit
                                type="text"
                                value={value}
                            />
                        )}
                    </UserTextForm>
                    <UserOptions>
                        <UserButton onClick={onCancel}>Actually, no, I do not want to delete this!</UserButton>
                    </UserOptions>
                </>
            )}
            {isLoading && (
                <>
                    <Speech mode="user">
                        <p>
                            <strong>PERMANENTLY DELETE</strong>
                        </p>
                    </Speech>
                    <Speech mode="system">
                        <div>All right, you asked for it.</div>
                        <Loader />
                    </Speech>
                </>
            )}
            {error && (
                <>
                    <Speech mode="user">
                        <p>
                            <strong>PERMANENTLY DELETE</strong>
                        </p>
                    </Speech>
                    <Speech mode="system">
                        <p>Whoops! There was some kind of error.</p>
                        <p>&ldquo;{String(error)}&rdquo;</p>
                    </Speech>
                    <UserOptions>
                        <UserButton icon={ICON_ARROW_CIRCLE} danger onClick={onConfirm}>
                            Try again.
                        </UserButton>
                        <UserButton icon={ICON_X} onClick={onCancel}>
                            Never mind.
                        </UserButton>
                    </UserOptions>
                </>
            )}
        </>
    )
}
export default PermanentDeletionConfirmation
