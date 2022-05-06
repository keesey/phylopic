import { isAuthority, isNamespace, isObjectID } from "@phylopic/utils"
import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
const Page: NextPage = () => null
export default Page
interface Query extends ParsedUrlQuery {
    authority: string
    namespace: string
    objectID: string
}
export const getServerSideProps: GetServerSideProps<Record<string, never>, Query> = async context => {
    const { authority, namespace, objectID } = context.query
    if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectID)) {
        return { notFound: true }
    }
    try {
        await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(
                namespace,
            )}/${encodeURIComponent(objectID)}`,
            {
                maxRedirects: 0,
            },
        )
    } catch (e) {
        if (axios.isAxiosError(e) && (e.response?.status === 307 || e.response?.status === 308)) {
            const location = e.response.headers.location
            if (location) {
                return {
                    redirect: {
                        destination: location,
                        permanent: e.response.status === 308,
                    },
                }
            }
        }
        throw e
    }
    return { notFound: true }
}
