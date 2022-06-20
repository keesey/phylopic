import { Contribution } from "@phylopic/source-models"
import { useStoredState } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import useFetcher from "~/auth/hooks/useFetcher"
import AnchorLink from "~/ui/AnchorLink"
import Loader from "~/ui/Loader"
import Finalize from "./Finalize"
import useImageSource from "./hooks/useImageSource"
import ImageView from "./ImageView"
import styles from "./index.module.scss"
import Taxonomy from "./Taxonomy"
import Usage from "./Usage"
import { WorkingSubmission } from "./WorkingSubmission"
export interface Props {
    uuid: UUID
}
const CollectMetadata: FC<Props> = ({ uuid }) => {
    const fetcher = useFetcher<Contribution>()
    const imageSource = useImageSource(uuid)
    const [prevSubmission, setPrevSubmission] = useStoredState<WorkingSubmission>("submission")
    const [submission, setSubmission] = useState<WorkingSubmission>(prevSubmission ?? {})
    const handleStepComplete = useCallback(
        (result: WorkingSubmission) => {
            setSubmission({ ...submission, ...result })
        },
        [submission],
    )
    useEffect(() => setPrevSubmission(submission), [setPrevSubmission, submission])
    const metadata = useSWR(`/api/images/${encodeURIComponent(uuid)}`, { fetcher })
    useEffect(() => {
        if (metadata?.data?.data) {
            setSubmission(metadata.data.data)
        }
    }, [metadata])
    const router = useRouter()
    const handleFinalizeComplete = useCallback(() => {
        router.push("/images")
    }, [router])
    const pending = useMemo(
        () => imageSource.pending || (metadata.isValidating && !(metadata.error || metadata.data)),
        [imageSource, metadata],
    )
    const error = useMemo(
        () =>
            imageSource.error ||
            (metadata.error && (!axios.isAxiosError(metadata.error) || metadata.error.response?.status !== 404)),
        [imageSource, metadata.error],
    )
    if (pending) {
        return <Loader />
    }
    if (error) {
        return (
            <section>
                <p>I think we got a little lost.</p>
                <AnchorLink href="/" className="cta">
                    Start over
                </AnchorLink>
            </section>
        )
    }
    return (
        <section className={styles.main}>
            <div>
                <ImageView source={imageSource.data} />
            </div>
            <div>
                <Taxonomy onComplete={handleStepComplete} suggestion={prevSubmission ?? undefined} />
            </div>
            <div>
                <Usage onComplete={handleStepComplete} suggestion={prevSubmission ?? undefined} />
            </div>
            <div>
                <Finalize onComplete={handleFinalizeComplete} submission={submission} uuid={uuid} />
            </div>
        </section>
    )
}
export default CollectMetadata
