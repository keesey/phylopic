import axios from "axios"
const login = async () => {
    const response = await axios.post(
        "http://phylopic.org/api/a/account/login",
        `email=${encodeURIComponent(process.env.PHYLOPIC_V1_EMAIL ?? "")}&password=${encodeURIComponent(
            process.env.PHYLOPIC_V1_PASSWORD ?? "",
        )}`,
        { withCredentials: true },
    )
    return response.headers["set-cookie"]?.[0]
        ?.split(/;/g)
        .map(cookie => cookie.trim().split("=", 2))
        .find(([key]) => key === "sessionid")?.[1]
}
export default login
