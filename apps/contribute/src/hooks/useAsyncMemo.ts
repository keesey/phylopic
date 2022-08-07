import { useMemo } from "react"
const useAsyncMemo = <T>(data: T | undefined, error: Error | undefined, pending: boolean) =>
    useMemo(
        () => ({
            data,
            error,
            pending,
        }),
        [data, error, pending],
    )
export default useAsyncMemo
