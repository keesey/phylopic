import { isSubmittableImage } from "@phylopic/source-models"
import { FC, useCallback, useMemo } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageDeletor from "~/editing/hooks/useImageDeletor"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useLiveImageExists from "~/editing/hooks/useLiveImageExists"
import useContributorUUID from "~/profile/useContributorUUID"
import ButtonNav from "~/ui/ButtonNav"
const Status: FC = () => {
    const image = useImage()
    if (!image) {
        return null
    }
    if (image.accepted) {
        if (image.submitted) {
            return <Accepted />
        }
        return <Withdrawn />
    }
    if (image.submitted) {
        return <Submitted />
    }
    return <Incomplete />
}
const Accepted: FC = () => {
    const uuid = useContributorUUID()
    const isLive = useLiveImageExists(uuid)
    const mutate = useImageMutator()
    const handleButtonClick = useCallback(() => {
        if (
            confirm(
                !isLive
                    ? "Are you sure you don’t want this image to be published on the site?"
                    : "Are you sure you want to remove your image from the site?",
            )
        ) {
            if (!isLive || confirm("Really???")) {
                mutate({ submitted: false })
            }
        }
    }, [isLive, mutate])
    return (
        <>
            <p>
                Your image has been accepted.{" "}
                {isLive && (
                    <>
                        It is currently{" "}
                        <a
                            href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images/${encodeURIComponent(uuid)}`}
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            on the site
                        </a>
                        .
                    </>
                )}
                {isLive === false && "It will be published to the site in the future."}
                {isLive === undefined && "Checking publication status…"}
            </p>
            {isLive !== undefined && (
                <ButtonNav mode="horizontal">
                    <button className="cta-delete" onClick={handleButtonClick}>
                        Withdraw this {isLive ? "image" : "submission"}
                    </button>
                </ButtonNav>
            )}
        </>
    )
}
const Incomplete: FC = () => {
    const image = useImage()
    const submittable = useMemo(() => isSubmittableImage(image), [image])
    const mutate = useImageMutator()
    const deleteImage = useImageDeletor()
    const handleSubmitButtonClick = useCallback(() => {
        mutate({ submitted: true })
    }, [mutate])
    const handleDeleteButtonClick = useCallback(() => {
        if (confirm("Are you sure you want cancel this submission PERMANENTLY?")) {
            deleteImage()
        }
    }, [deleteImage])
    return (
        <>
            <p>{submittable ? "You’re all set!" : "Looks like you have some work to do before submitting this one."}</p>
            <ButtonNav mode="horizontal">
                {submittable && (
                    <button className="cta" onClick={handleSubmitButtonClick}>
                        Submit it
                    </button>
                )}
                <button className="cta-delete" onClick={handleDeleteButtonClick}>
                    Cancel
                </button>
            </ButtonNav>
        </>
    )
}
const Submitted: FC = () => {
    const mutate = useImageMutator()
    const handleButtonClick = useCallback(() => {
        if (confirm("Are you sure you don’t want this image to be published on the site?")) {
            mutate({ submitted: false })
        }
    }, [mutate])
    return (
        <>
            <p>Your image has been submitted and will be reviewed.</p>
            <ButtonNav mode="horizontal">
                <button className="cta-delete" onClick={handleButtonClick}>
                    Withdraw this submission
                </button>
            </ButtonNav>
        </>
    )
}
const Withdrawn: FC = () => {
    const mutate = useImageMutator()
    const deleteImage = useImageDeletor()
    const handleDeleteButtonClick = useCallback(() => {
        if (confirm("Are you sure you want remove this image PERMANENTLY?")) {
            deleteImage()
        }
    }, [deleteImage])
    const handleSubmitButtonClick = useCallback(() => {
        mutate({ submitted: true })
    }, [mutate])
    return (
        <>
            <p>This image was previously accepted, but you have withdrawn it.</p>
            <ButtonNav mode="horizontal">
                <button className="cta" onClick={handleSubmitButtonClick}>
                    Submit it again
                </button>
                <button className="cta-delete" onClick={handleDeleteButtonClick}>
                    Delete it permanently
                </button>
            </ButtonNav>
        </>
    )
}
export default Status
