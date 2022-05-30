import { FC } from "react"
import Card from "./Card"
import styles from "./index.module.scss"

const PocketPhylogenies: FC = () => {
    return (
        <section className={styles.main}>
            <Card index={1} />
            <Card index={2} />
            <Card index={3} />
            <Card index={4} />
            <Card index={5} />
        </section>
    )
}
export default PocketPhylogenies
