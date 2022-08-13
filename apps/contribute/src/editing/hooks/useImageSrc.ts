import useImageSrcSWR from "./useImageSrcSWR"
const useImageSrc = () => {
    const { data } = useImageSrcSWR()
    return data
}
export default useImageSrc
