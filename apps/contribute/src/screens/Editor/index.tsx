import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageSrc from "~/editing/hooks/useImageSrc"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import ImageView from "~/ui/ImageView"
import LoadingState from "../LoadingState"
import SubmitButton from "./SubmitButton"
import useRedirect from "./useRedirect"
import WithdrawButton from "./WithdrawButton"
import useSWRImmutable from "swr/immutable"
import { useAPIFetcher } from "@phylopic/utils-api"
import { Node } from "@phylopic/api-models"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useFileSourceComplete from "~/editing/hooks/steps/useFileSourceComplete"
import useNodesComplete from "~/editing/hooks/steps/useNodesComplete"
import { isSubmittableImage } from "@phylopic/source-models"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const image = useImage()
    const src = useImageSrc()
    const mutate = useImageMutator()
    const apiFetcher = useAPIFetcher<Node>()
    const { data: specific } = useSWRImmutable(
        image?.specific ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.specific)}` : null,
        apiFetcher,
    )
    const { data: general } = useSWRImmutable(
        image?.general ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.general)}` : null,
        apiFetcher,
    )
    const router = useRouter()
    const handleEdit = useCallback(
        (section: "file" | "nodes" | "usage") => {
            router.push(`/edit/${encodeURIComponent(uuid)}/${encodeURIComponent(section)}`)
        },
        [router],
    )
    const { pending, redirecting } = useRedirect(uuid)
    if (!image || pending || redirecting) {
        return <LoadingState>Checking contribution status…</LoadingState>
    }
    return (
        <DialogueScreen>
            <ImageView
                attribution={image.attribution}
                general={general}
                license={image.license}
                onEdit={handleEdit}
                specific={specific}
                src={src}
            />
            <nav>
                <SubmitButton />
                <WithdrawButton />
            </nav>
        </DialogueScreen>
    )
}
export default Editor
