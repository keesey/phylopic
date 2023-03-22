import { UUID } from "@phylopic/utils"
import { FC } from "react"
import DeletionConfirmation from "~/ui/DeletionConfirmation"
import Speech from "~/ui/Speech"
import useAuthorizedImageDeletor from "./useAuthorizedImageDeletor"
export type Props = {
    onCancel?: () => void
    uuid: UUID
}
const DeleteImage: FC<Props> = ({ onCancel, uuid }) => {
    const deletor = useAuthorizedImageDeletor(uuid)
    return (
        <>
            <Speech mode="user">
                <p>Remove this from the site.</p>
            </Speech>
            <DeletionConfirmation
                error={deletor.error}
                isDeleted={deletor.deleted}
                isLoading={deletor.isLoading}
                onCancel={onCancel}
                onConfirm={deletor.mutate}
            />
        </>
    )
}
export default DeleteImage
