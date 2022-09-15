import { isAuthority, isNamespace, isObjectID } from "@phylopic/utils"
import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
const PageComponent: NextPage = () => null
export default PageComponent
interface PageQuery extends ParsedUrlQuery {
    authority: string
    namespace: string
    objectID: string
}
export const getServerSideProps: GetServerSideProps<Record<string, never>, PageQuery> = async context => {
    const { authority, namespace, objectID } = context.query
    if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectID)) {
        return { notFound: true }
    }
    try {
        await axios.get<never>(
            [
                process.env.NEXT_PUBLIC_API_URL,
                "resolve",
                encodeURIComponent(authority),
                encodeURIComponent(namespace),
                encodeURIComponent(objectID),
            ].join("/"),
            {
                maxRedirects: 0,
            },
        )
    } catch (e) {
        if (axios.isAxiosError(e)) {
            if (e.response?.status === 307 || e.response?.status === 308) {
                const destination = e.response?.headers.location
                if (destination) {
                    return {
                        redirect: {
                            destination,
                            permanent: e.response?.status === 308,
                        },
                    }
                }
            }
        }
    }
    return { notFound: true }
}
