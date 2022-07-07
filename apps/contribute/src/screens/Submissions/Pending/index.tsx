import { InfiniteScroll, Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo } from "react"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import useSubmissionsSWR from "~/s3/swr/useSubmissionsSWR"
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
            {submissionUUIDs.length > 0 && (
                <ul key="list">
                    {submissionUUIDs.map(uuid => (
                        <li key={uuid}>{uuid}</li>
                    ))}
                </ul>
            )}
            {!isValidating && submissionUUIDs.length === 0 && <p>You have no pending submissions.</p>}
            {isValidating && <Loader key="loader" color="#ffffff" />}
            {!isValidating && !lastPage && (
                <InfiniteScroll key="scroll" onInViewport={handleInfiniteScrollInViewport} />
            )}
        </>
    )
}
export default Pending
