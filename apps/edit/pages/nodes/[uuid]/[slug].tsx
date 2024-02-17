import { type GetServerSideProps } from "next";
export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: ".",
            permanent: true,
        }
    }
}
export default function () {
    return null;
}