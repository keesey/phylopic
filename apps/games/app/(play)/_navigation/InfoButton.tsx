"use client"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Drawer } from "~/components/Drawer"
import { GameRules } from "~/components/GameRules"
import { GAMES } from "~/games/GAMES"
import styles from "./InfoButton.module.scss"
const InfoButton = () => {
    const [open, setOpen] = useState(false)
    const { code } = useParams<{ code?: string }>()
    return (
        <>
            <button className={styles.button} onClick={() => setOpen(true)} disabled={open} title="How to Play">
                ⓘ
            </button>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <header>
                    <h2>How to Play</h2>
                </header>
                <GameRules code={code} />
            </Drawer>
        </>
    )
}
export default InfoButton
