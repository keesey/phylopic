import axios from "axios"
const fetchExists = async (key: string) => {
    const response = await axios.head(key)
    return response.status >= 200 && response.status < 400
}
export default fetchExists
