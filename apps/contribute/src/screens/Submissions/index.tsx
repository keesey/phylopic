import { BuildContainer } from "@phylopic/utils-api"
import { FC } from "react"
import Greeting from "./Greeting"
import styles from "./index.module.scss"
import Pending from "./Pending"
import Published from "./Published"
const Submissions: FC = () => {
    return (
        <BuildContainer>
            <section className={styles.main}>
                <Greeting />
                <Pending />
                <Published />
            </section>
        </BuildContainer>
    )
}
export default Submissions
