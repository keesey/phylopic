import { InfiniteScroll, Loader, NumberView } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo } from "react"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import useSubmissionsSWR from "~/s3/swr/useSubmissionsSWR"
import Banner from "~/ui/Banner"
import SpawnLink from "~/ui/SpawnLink"
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
        <>
            <div>
                {isValidating && submissionUUIDs.length === 0 && <>Loading pending submissions…</>}
                {!isValidating && submissionUUIDs.length === 0 && (
                    <>
                        {"You have no pending submissions. "}
                        <SpawnLink>
                            Upload a new image.
                        </SpawnLink>
                    </>
                )}
                {!isValidating && submissionUUIDs.length !== 0 && (
                    <>
                        You have <NumberView value={submissionUUIDs.length} /> pending submission
                        {submissionUUIDs.length === 1 ? "" : "s"}.
                    </>
                )}
            </div>
            <div className="thumbnails">
                <Banner>
                    {isValidating && <Loader key="loader" />}
                    {!isValidating && !lastPage && (
                        <InfiniteScroll key="scroll" onInViewport={handleInfiniteScrollInViewport} />
                    )}
                </Banner>
            </div>
        </>
    )
}
export default Pending
