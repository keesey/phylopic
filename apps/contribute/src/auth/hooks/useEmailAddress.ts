import usePayload from "./usePayload"
const useEmailAddress = () => {
    const { sub } = usePayload() ?? {}
    return sub ?? null
}
export default useEmailAddress
