import { SWRResponse } from "swr"
const isLoading = (response: SWRResponse) => !response.data && response.isValidating
export default isLoading
