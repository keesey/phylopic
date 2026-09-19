import NomenView from "~/components/NomenView"
import styles from "./index.module.scss"
export const Rules = () => {
    return (
        <div className={styles.main}>
            <section>
                <h3>Sort Images into Four Clades</h3>
                <p>
                    These sixteen silhouettes represent four distinct <em>clades</em>.
                </p>
                <ul>
                    <li>
                        A clade is an ancestral species plus <em>all</em> of its descendants.
                    </li>
                    <li>
                        Examples of clades: <NomenView value={[{ class: "scientific", text: "Aves" }]} /> (birds),{" "}
                        <NomenView value={[{ class: "scientific", text: "Angiospermae" }]} /> (flowering plants),{" "}
                        <NomenView value={[{ class: "scientific", text: "Eubacteria" }]} />.
                    </li>
                    <li>
                        Species with no (current) descendants are also clades:{" "}
                        <NomenView value={[{ class: "scientific", text: "Homo sapiens" }]} />,{" "}
                        <NomenView value={[{ class: "scientific", text: "Tyrannosaurus rex" }]} />.
                    </li>
                </ul>
            </section>
            <section>
                <h3>Gameplay</h3>
                <ul>
                    <li>Select four of the silhouettes and press the &ldquo;Submit&rdquo; button.</li>
                    <li>
                        If those four represent a clade that does not include the other twelve, they will be removed
                        from the board and you will see the clade listed above.
                    </li>
                    <li>
                        Otherwise, this will be counted as a mistake. <em>You only get four mistakes!</em>
                    </li>
                </ul>
            </section>
        </div>
    )
}
