import { isDefined } from "@phylopic/utils"
import { useMemo } from "react"
const useFileTooBig = (file: File | undefined, maxFileSize: number) => {
    return useMemo(() => (isDefined(file) ? file.size > maxFileSize : undefined), [file, maxFileSize])
}
export default useFileTooBig
