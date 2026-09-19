import { FC } from "react"
import styles from "./index.module.scss"
export interface NewGameButtonProps {
    onClick: () => void
}
export const NewGameButton: FC<NewGameButtonProps> = ({ onClick }) => {
    return (
        <button className={styles.main} onClick={onClick}>
            ▶ New Practice Game
        </button>
    )
}
