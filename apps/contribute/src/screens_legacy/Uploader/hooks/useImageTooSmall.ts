import { useMemo } from "react"
const useImageTooSmall = (
    size: Readonly<[number, number]> | undefined,
    minLength: number,
    minArea: number,
    enabled: boolean,
) => {
    return useMemo(() => {
        if (size && enabled) {
            const length = Math.max(...size)
            const area = size[0] * size[1]
            return length < minLength || area < minArea
        }
    }, [enabled, minArea, minLength, size])
}
export default useImageTooSmall
