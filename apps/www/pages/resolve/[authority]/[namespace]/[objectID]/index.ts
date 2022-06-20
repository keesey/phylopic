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
    const response = await axios.get<never>(
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
    if (response.status !== 307 && response.status !== 308) {
        return { notFound: true }
    }
    const destination = response.headers.location
    if (destination) {
        return {
            redirect: {
                destination,
                permanent: response.status === 308,
            },
        }
    }
    return { notFound: true }
}
