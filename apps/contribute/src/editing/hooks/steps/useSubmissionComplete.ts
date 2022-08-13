import useImage from "../useImage"
const useSubmissionComplete = () => {
    const image = useImage()
    return image ? image.submitted : undefined
}
export default useSubmissionComplete
