import Container from "~/ui/Container"
import Schema from "./schema"

const Page = () => {
    return (
        <>
            <Schema />
            <header>
                <Container>
                    <strong>Free silhouette images</strong> of animals, plants, and other life forms,{" "}
                    <strong>available for reuse</strong> under{" "}
                    <a href="//creativecommons.org" rel="external">
                        Creative Commons
                    </a>{" "}
                    licenses.
                </Container>
            </header>
        </>
    )
}
export default Page
