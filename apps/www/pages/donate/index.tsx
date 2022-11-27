import { GetServerSideProps } from "next"
const Page = () => null
export default Page
export const getServerSideProps: GetServerSideProps<{}> = async () => {
    return {
        redirect: {
            basePath: false,
            destination: "https://www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW",
            permanent: true,
        },
    }
}
