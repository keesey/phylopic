import { FC } from "react"
import styles from "./Controls.module.scss"
import { PlayButton } from "./PlayButton"
import { RedoButton } from "./RedoButton"
import { RegenerateButton } from "./RegenerateButton"
import { SaveButton } from "./SaveButton"
import { UndoButton } from "./UndoButton"
import { GameInstance } from "~/lib/s3/GameInstance"
export interface Props {
    code: string
    onSave: (instance: GameInstance<unknown>) => Promise<void>
}
export const Controls: FC<Props> = ({ code, onSave }) => {
    return (
        <nav className={styles.nav}>
            <SaveButton code={code} onSave={onSave} />
            <RegenerateButton code={code} />
            <UndoButton />
            <RedoButton />
            <PlayButton code={code} />
        </nav>
    )
}
