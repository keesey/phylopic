"use client"
import { FC, Suspense, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Menu from "./Menu"
import styles from "./MenuButton.module.scss"
const MenuButton: FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <>
            <div className={styles.menuButton}>
                <button
                    className={styles.button}
                    onClick={() => {
                        setDropdownOpen(!dropdownOpen)
                    }}
                >
                    ☰
                </button>
            </div>
            {mounted &&
                dropdownOpen &&
                createPortal(
                    <Suspense fallback={null}>
                        <Menu
                            onClose={() => {
                                setDropdownOpen(false)
                            }}
                        />
                    </Suspense>,
                    document.body,
                )}
        </>
    )
}
export default MenuButton
