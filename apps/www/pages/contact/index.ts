import type { GetStaticProps, NextPage } from "next"
const PageComponent: NextPage = () => null
export default PageComponent
export const getStaticProps: GetStaticProps = () => {
    return {
        redirect: {
            destination: `/contributors/${encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID ?? "")}`,
            permanent: true,
        },
    }
}
