import { Node } from "@phylopic/api-models"
import { Submission } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useHasSourceImage from "~/editing/useHasSourceImage"
import useHasSubmission from "~/editing/useHasSubmission"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import useImageSWR from "~/s3/swr/useImageSWR"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
import SubmissionView from "~/ui/SubmissionView"
import CompleteButton from "./CompleteButton"
import DeleteButton from "./DeleteButton"
import styles from "./index.module.scss"
import useRedirect from "./useRedirect"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const contributorUUID = useContributorUUID()
    const hasSource = useHasSourceImage(uuid)
    const hasSubmission = useHasSubmission(uuid)
    const { data: image } = useImageSWR(hasSource ? uuid : null)
    const { data: submission } = useSubmissionSWR(hasSubmission ? uuid : null)
    const router = useRouter()
    const handleEdit = useCallback(
        (section: "file" | "nodes" | "usage") => {
            router.push(`/edit/${encodeURIComponent(uuid)}/${encodeURIComponent(section)}`)
        },
        [router],
    )
    const { pending } = useRedirect(uuid)
    const apiFetcher = useAPIFetcher<Node>()
    const { data: imageSpecificNode } = useSWRImmutable(
        image?.specific ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.specific)}` : null,
        apiFetcher,
    )
    const { data: imageGeneralNode } = useSWRImmutable(
        image?.general ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.general)}` : null,
        apiFetcher,
    )
    const sourceData = useMemo<Submission | null>(() => {
        if (!image) {
            return null
        }
        return {
            ...image,
            specific: {
                identifier: `phylopic.org/nodes/${encodeURIComponent(image.specific)}`,
                name: imageSpecificNode ? imageSpecificNode.names[0] : [{ class: "vernacular", text: "..." }],
            },
            general: image.general
                ? {
                      identifier: `phylopic.org/nodes/${encodeURIComponent(image.general)}`,
                      name: imageGeneralNode ? imageGeneralNode.names[0] : [{ class: "vernacular", text: "..." }],
                  }
                : null,
        }
    }, [image, imageGeneralNode, imageSpecificNode])
    const submissionData = useMemo<Submission | null>(() => {
        return submission ? { ...sourceData, ...submission } : null
    }, [sourceData, submission])
    if (pending || hasSource == undefined || hasSubmission === undefined) {
        return (
            <DialogueScreen>
                <Loader />
            </DialogueScreen>
        )
    }
    return (
        <DialogueScreen>
            <div className={styles.submissions}>
                {sourceData && (
                    <SubmissionView
                        key="source"
                        header="Accepted Image"
                        imageSrc={`/api/images/${encodeURIComponent(uuid)}/source`}
                        onEdit={handleEdit}
                        submission={sourceData}
                    />
                )}
                {sourceData && submissionData && contributorUUID && (
                    <span key="divider" className={styles.divider}></span>
                )}
                {submissionData && contributorUUID && (
                    <SubmissionView
                        key="submission"
                        header={hasSource ? "Pending Changes" : "Your Submission"}
                        imageSrc={`/api/submissions/${encodeURIComponent(uuid)}/source/${encodeURIComponent(
                            contributorUUID,
                        )}`}
                        onEdit={handleEdit}
                        submission={submissionData}
                    />
                )}
            </div>
            <nav>
                <CompleteButton uuid={uuid} />
                <DeleteButton uuid={uuid} />
            </nav>
        </DialogueScreen>
    )
}
export default Editor
