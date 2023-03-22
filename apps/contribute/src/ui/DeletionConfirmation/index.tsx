import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import PermanentDeletionConfirmation from "~/ui/DeletionConfirmation/PermanentDeletionConfirmation"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    error?: Error
    isDeleted?: boolean
    isLoading?: boolean
    onCancel?: () => void
    onConfirm?: () => void
}
const USER_PROMPT = "Yes, I really want to delete it."
const DeletionConfirmation: FC<Props> = ({ error, isDeleted, isLoading, onCancel, onConfirm }) => {
    const [confirming, setConfirming] = useState(false)
    const router = useRouter()
    useEffect(() => {
        if (isDeleted) {
            router.push("/confirmed")
        }
    }, [isDeleted, router])
    return (
        <>
            <Speech mode="system">
                <p>
                    Are you <strong>absolutely sure</strong> you want to <strong>PERMANENTLY</strong> delete this?
                </p>
            </Speech>
            {!confirming && (
                <UserOptions>
                    <UserButton onClick={onCancel}>Whoops! No, I do not want to delete this.</UserButton>
                    <UserButton danger onClick={() => setConfirming(true)}>
                        {USER_PROMPT}
                    </UserButton>
                </UserOptions>
            )}
            {confirming && (
                <>
                    <Speech mode="user">
                        <p>{USER_PROMPT}</p>
                    </Speech>
                    <PermanentDeletionConfirmation
                        error={error}
                        isLoading={isLoading}
                        onCancel={onCancel}
                        onConfirm={onConfirm}
                    />
                </>
            )}
        </>
    )
}
export default DeletionConfirmation
