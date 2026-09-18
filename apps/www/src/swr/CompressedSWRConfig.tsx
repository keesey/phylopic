import type { Compressed } from "compress-json"
import type { FC, PropsWithChildren } from "react"
import { SWRConfig } from "swr"
import useCompressedFallback from "./useCompressedFallback"

export type Props = PropsWithChildren<{
    fallback?: Compressed
}>

const CompressedSWRConfig: FC<Props> = ({ children, fallback: compressedFallback }) => {
    const fallback = useCompressedFallback(compressedFallback)
    return <SWRConfig value={{ fallback }}>{children}</SWRConfig>
}

export default CompressedSWRConfig
