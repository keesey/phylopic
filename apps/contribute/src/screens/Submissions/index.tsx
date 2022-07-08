import { FC } from "react"
import Greeting from "./Greeting"
import styles from "./index.module.scss"
import Pending from "./Pending"
import Published from "./Published"
const Submissions: FC = () => {
    return (
        <section className={styles.main}>
            <Greeting />
            <Pending />
            <Published />
        </section>
    )
}
export default Submissions
