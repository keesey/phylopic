import useImageSWR from "../useImageSWR"
const useNodesComplete = () => {
    const { data } = useImageSWR()
    return !data ? undefined : Boolean(data.specific)
}
export default useNodesComplete
