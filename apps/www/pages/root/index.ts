import type { GetStaticProps, NextPage } from "next"
const PageComponent: NextPage = () => null
export default PageComponent
export const getStaticProps: GetStaticProps = () => {
    return {
        redirect: {
            destination: `/nodes/${encodeURIComponent(process.env.NEXT_PUBLIC_ROOT_UUID ?? "")}`,
            permanent: false,
        },
    }
}
