import { useMemo } from "react"
const useVectorizedImageSource = (svgData: string | undefined) =>
    useMemo(() => (svgData ? `data:image/svg+xml,${encodeURIComponent(svgData)}` : undefined), [svgData])
export default useVectorizedImageSource
