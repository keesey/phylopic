import { FC, useCallback } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
const WithdrawButton: FC = () => {
    const image = useImage()
    const mutate = useImageMutator()
    const handleClick = useCallback(() => {
        if (
            confirm(
                !image?.accepted
                    ? "Are you sure you want to cancel this submission?"
                    : "Are you sure you want to withdraw this submission? This will remove it from the site in the future.",
            )
        ) {
            mutate({ submitted: false })
        }
    }, [image?.accepted, mutate])
    if (!image?.submitted) {
        return null
    }
    return (
        <button className="cta-delete" onClick={handleClick}>
            {image?.accepted ? "Withdraw this image" : "Cancel this submission"}
        </button>
    )
}
export default WithdrawButton
