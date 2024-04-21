import { FC } from "react"
import styles from "./Controls.module.scss"
import { PlayButton } from "./PlayButton"
import { RedoButton } from "./RedoButton"
import { RegenerateButton } from "./RegenerateButton"
import { SaveButton } from "./SaveButton"
import { UndoButton } from "./UndoButton"
export interface Props {
    code: string
}
export const Controls: FC<Props> = ({ code }) => {
    return (
        <nav className={styles.nav}>
            <SaveButton />
            <RegenerateButton code={code} />
            <UndoButton />
            <RedoButton />
            <PlayButton code={code} />
        </nav>
    )
}
