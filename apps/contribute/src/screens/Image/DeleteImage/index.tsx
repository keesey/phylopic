import { UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import SiteTitle from "~/ui/SiteTitle"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserInput from "~/ui/UserInput"
import UserOptions from "~/ui/UserOptions"
import UserTextForm from "~/ui/UserTextForm"
import axios from "axios"
import useAuthorizedImageDeletor from "./useAuthorizedImageDeletor"
import { Loader } from "@phylopic/ui"
import ErrorState from "~/screens/ErrorState"
import { ICON_ARROW_CIRCLE, ICON_ARROW_UP, ICON_HAND_POINT_RIGHT, ICON_X } from "~/ui/ICON_SYMBOLS"
import UserLinkButton from "~/ui/UserLinkButton"
export type Props = {
    onCancel?: () => void
    uuid: UUID
}
const CONFIRMATION_TEXT = "PERMANENTLY DELETE"
const DeleteImage: FC<Props> = ({ onCancel, uuid }) => {
    const [confirming, setConfirming] = useState(false)
    const deletor = useAuthorizedImageDeletor(uuid)
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
                    {!deletor.deleted && !deletor.isLoading && (
                        <>
                            <UserTextForm editable value="" onSubmit={() => deletor.mutate()}>
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
                    {deletor.isLoading && (
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
                    {deletor.error && (
                        <>
                            <Speech mode="user">
                                <p>
                                    <strong>PERMANENTLY DELETE</strong>
                                </p>
                            </Speech>
                            <Speech mode="system">
                                <p>Whoops! There was some kind of error.</p>
                                <p>&ldquo;{String(deletor.error)}&rdquo;</p>
                            </Speech>
                            <UserOptions>
                                <UserButton icon={ICON_ARROW_CIRCLE} danger onClick={deletor.mutate}>
                                    Try again.
                                </UserButton>
                                <UserButton icon={ICON_X} onClick={onCancel}>
                                    Never mind.
                                </UserButton>
                            </UserOptions>
                        </>
                    )}
                    {deletor.deleted && (
                        <>
                            <Speech mode="user">
                                <p>
                                    <strong>PERMANENTLY DELETE</strong>
                                </p>
                            </Speech>
                            <Speech mode="system">
                                <p>All right, you asked for it.</p>
                                <p>
                                    The next time <SiteTitle /> is updated, this image will be gone.
                                </p>
                            </Speech>
                            <Speech mode="system">
                                <p>What do you want to do next?</p>
                            </Speech>
                            <UserOptions>
                                <UserLinkButton icon={ICON_ARROW_UP} href="/upload">
                                    Upload a new image.
                                </UserLinkButton>
                                <UserLinkButton icon={ICON_HAND_POINT_RIGHT} href="/images">
                                    Check out my accepted submissions.
                                </UserLinkButton>
                                <UserLinkButton icon={ICON_HAND_POINT_RIGHT} href="/submission">
                                    Check out my pending submissions.
                                </UserLinkButton>
                            </UserOptions>
                        </>
                    )}
                </>
            )}
        </>
    )
}
export default DeleteImage
