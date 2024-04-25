"use client"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Drawer } from "~/components/Drawer"
import { GAMES } from "~/games/GAMES"
import styles from "./InfoButton.module.scss"
const InfoButton = () => {
    const [open, setOpen] = useState(false)
    const { code } = useParams<{ code?: string }>()
    return (
        <>
            <button className={styles.button} onClick={() => setOpen(true)} disabled={open}>
                ⓘ
            </button>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <header>{code && <h2>Rules for {GAMES[code].title}</h2>}</header>
            </Drawer>
        </>
    )
}
export default InfoButton
