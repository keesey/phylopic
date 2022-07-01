import usePayload from "./usePayload"
const useExpiration = () => {
    const payload = usePayload()
    return typeof payload?.exp === "number" ? payload.exp * 1000 : null
}
export default useExpiration
