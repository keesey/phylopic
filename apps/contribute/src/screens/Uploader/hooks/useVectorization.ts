import { trace } from "potrace"
import useSWRImmutable from "swr/immutable"
const traceSVG = (buffer: Buffer) => new Promise<string>((resolve, reject) => {
    trace(buffer, (error, svg) => {
        if (error) {
            reject(error)
        } else {
            resolve(svg)
        }
    })
})
const useVectorization = (buffer: Buffer | undefined, enabled: boolean) => {
    const { data, error, isValidating } = useSWRImmutable((enabled && buffer) || null, traceSVG)
    return { data, error, pending: !data && !error && isValidating }
}
export default useVectorization
