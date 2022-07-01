import { useMemo } from "react"
const useFileIsVector = (file: File | undefined) =>
    useMemo(() => (file ? file?.type === "image/svg+xml" : undefined), [file])
export default useFileIsVector
