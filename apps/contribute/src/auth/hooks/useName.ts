import usePayload from "./usePayload"
const useName = () => {
    const { name } = usePayload() ?? {}
    return name ?? null
}
export default useName
