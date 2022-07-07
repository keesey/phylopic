import { AnchorLink, InfiniteScroll, Loader, NumberView } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo } from "react"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import useSubmissionsSWR from "~/s3/swr/useSubmissionsSWR"
import Banner from "~/ui/Banner"
const Pending: FC = () => {
    const emailAddress = useEmailAddress()
    const { data, isValidating, setSize, size } = useSubmissionsSWR(emailAddress)
    const submissionUUIDs = useMemo<readonly UUID[]>(
        () => data?.reduce<readonly UUID[]>((prev, value) => [...prev, ...value.uuids], []) ?? [],
        [data],
    )
    const handleInfiniteScrollInViewport = useCallback(() => setSize(size + 1), [setSize, size])
    const lastPage = useMemo(() => Boolean(data?.length && !data[data.length - 1]?.uuids.length), [data])
    return (
        <section>
            <p>
                {isValidating && submissionUUIDs.length === 0 && "Pending submissions."}
                {!isValidating && submissionUUIDs.length === 0 && "You have no pending submissions."}
                {!isValidating && submissionUUIDs.length !== 0 && (
                    <>
                        You have <NumberView value={submissionUUIDs.length} /> pending submission
                        {submissionUUIDs.length === 1 ? "" : "s"}.
                    </>
                )}
            </p>
            <Banner>
                {isValidating && <Loader key="loader" color="#ffffff" />}
                {!isValidating && submissionUUIDs.length === 0 && (
                    <AnchorLink className="cta" href="/submissions/new">
                        Upload an Image
                    </AnchorLink>
                )}
                {!isValidating && !lastPage && (
                    <InfiniteScroll key="scroll" onInViewport={handleInfiniteScrollInViewport} loaderColor="#ffffff" />
                )}
            </Banner>
        </section>
    )
}
export default Pending
