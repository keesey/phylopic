import styles from "./Instructions.module.scss"
const Instructions = () => {
    return (
        <header className={styles.main}>
            <p>
                <span>Sort these into four separate clades.</span>
                <br />
                <span className={styles.comment}>
                    (A clade is an ancestor plus all descendants, like "mammals" or "frogs" or "flowering plants".)
                </span>
            </p>
        </header>
    )
}
export default Instructions
