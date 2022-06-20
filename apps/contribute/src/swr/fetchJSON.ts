import axios from "axios"
const fetchJSON = async <T>(key: string) => {
    const response = await axios.get<T>(key, {
        responseType: "json",
    })
    return response.data
}
export default fetchJSON
