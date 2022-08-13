import useImageSWR from "./useImageSWR"
const useImage = () => {
    const { data } = useImageSWR()
    return data
}
export default useImage
