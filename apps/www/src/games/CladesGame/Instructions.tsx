import styles from "./Instructions.module.scss"
const Instructions = () => {
    return (
        <header className={styles.main}>
            <p>
                <span>Sort these into four separate clades.</span>
                <br />
                <span className={styles.comment}>
                    (A clade is an ancestor plus all descendants, like &ldquo;mammals&rdquo; or &ldquo;frogs&rdquo; or
                    &ldquo;flowering plants&rdquo;.)
                </span>
            </p>
        </header>
    )
}
export default Instructions
