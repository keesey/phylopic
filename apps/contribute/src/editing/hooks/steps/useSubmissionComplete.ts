import { UUID } from "@phylopic/utils"
import useImage from "../useImage"
const useSubmissionComplete = (uuid: UUID | undefined) => {
    const image = useImage(uuid)
    return image ? image.submitted : undefined
}
export default useSubmissionComplete
