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
    readOnly: boolean
}
export const Controls: FC<Props> = ({ code, onSave, readOnly }) => {
    return (
        <nav className={styles.nav}>
            <SaveButton code={code} onSave={onSave} readOnly={readOnly} />
            <RegenerateButton code={code} readOnly={readOnly} />
            <UndoButton readOnly={readOnly} />
            <RedoButton readOnly={readOnly} />
            <PlayButton code={code} />
        </nav>
    )
}
