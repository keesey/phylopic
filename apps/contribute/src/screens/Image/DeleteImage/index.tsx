import { UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import SiteTitle from "~/ui/SiteTitle"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserInput from "~/ui/UserInput"
import UserOptions from "~/ui/UserOptions"
import UserTextForm from "~/ui/UserTextForm"
export type Props = {
    onCancel?: () => void
    uuid: UUID
}
const CONFIRMATION_TEXT = "PERMANENTLY DELETE"
const DeleteImage: FC<Props> = ({ onCancel, uuid }) => {
    const [confirming, setConfirming] = useState(false)
    const handleConfirmationFormSubmit = (value: string) => {
        if (value !== CONFIRMATION_TEXT) {
            alert("That is not what I asked you to type.")
        } else {
            // Delete the image
        }
    }
    return (
        <>
            <Speech mode="user">
                <p>Remove this from the site.</p>
            </Speech>
            <Speech mode="system">
                <p>
                    Are you <strong>absolutely sure</strong> you want to <strong>PERMANENTLY</strong> delete this image
                    from <SiteTitle />?
                </p>
            </Speech>
            {!confirming && (
                <UserOptions>
                    <UserButton onClick={onCancel}>Whoops! No, I do not want to delete this.</UserButton>
                    <UserButton danger onClick={() => setConfirming(true)}>
                        Yes, I really want to delete it.
                    </UserButton>
                </UserOptions>
            )}
            {confirming && (
                <>
                    <Speech mode="user">
                        <p>Yes, I really want to delete it.</p>
                    </Speech>
                    <Speech mode="system">
                        <p>
                            Wow. O.K., if you&rsquo;re <strong>really sure</strong>, please type{" "}
                            <em>{CONFIRMATION_TEXT}</em> below.
                        </p>
                    </Speech>
                    <UserTextForm editable value="" onSubmit={handleConfirmationFormSubmit}>
                        {(value, setValue) => (
                            <UserInput
                                id="confirmation"
                                name="confirmation"
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
        </>
    )
}
export default DeleteImage
