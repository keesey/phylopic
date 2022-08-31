import { Image, isSubmittableImage } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useMemo } from "react"
import useImageDeletor from "~/editing/useSubmissionDeletor"
import useImageMutator from "~/editing/useImageMutator"
import useImageSpawn from "~/editing/useImageSpawn"
import { ICON_CHECK, ICON_DANGER, ICON_PLUS, ICON_X } from "~/ui/ICON_SYMBOLS"
import MenuButton from "../../MenuButton"
import MenuDivider from "../../MenuDivider"
export type Props = {
    image?: Image & { uuid: UUID }
}
const FileMenu: FC<Props> = ({ image }) => {
    const submittable = useMemo(() => isSubmittableImage(image), [image])
    const mutator = useImageMutator(image?.uuid)
    const deletor = useImageDeletor(image?.uuid)
    const [spawn, spawnError, spawnPending] = useImageSpawn()
    useEffect(() => {
        if (spawnError) {
            alert(String(spawnError))
        }
    }, [spawnError])
    const withdraw = useCallback(() => {
        if (
            confirm(
                `Are you sure you want to ${
                    image?.accepted ? "remove this image from the site" : "withdraw this submission"
                }? It’s so nice!`,
            )
        ) {
            mutator({ submitted: false })
            if (image?.accepted) {
                alert("This image will be removed from the site in the next build.")
            }
        }
    }, [image?.accepted, mutator])
    const submit = useCallback(() => {
        mutator({ submitted: true })
    }, [mutator])
    const router = useRouter()
    const deleteImage = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission?")) {
            deletor()
            router.push("/")
        }
    }, [deletor, router])
    return (
        <>
            <MenuButton disabled={spawnPending} icon={ICON_PLUS} label="Upload New Image" onClick={spawn} />
            {image && (
                <>
                    <MenuDivider />
                    {!image.submitted && !image.accepted && submittable && (
                        <MenuButton icon={ICON_CHECK} label="Submit this Image" onClick={submit} />
                    )}
                    {!image.submitted && (
                        <MenuButton icon={ICON_DANGER} label="Delete this Submission" onClick={deleteImage} />
                    )}
                    {image.submitted && (
                        <MenuButton icon={ICON_X} label="Withdraw this Submission" onClick={withdraw} />
                    )}
                </>
            )}
        </>
    )
}
export default FileMenu
