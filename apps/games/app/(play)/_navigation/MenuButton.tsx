"use client"
import { FC, Suspense, useState } from "react"
import Menu from "./Menu"
import styles from "./MenuButton.module.scss"
const MenuButton: FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    return (
        <>
            <div className={styles.menuButton}>
                <button
                    onClick={() => {
                        //customEvents.toggleSiteMenu(!dropdownOpen)
                        setDropdownOpen(!dropdownOpen)
                    }}
                >
                    ☰
                </button>
            </div>
            {dropdownOpen && (
                <Suspense>
                    <Menu
                        onClose={() => {
                            //customEvents.toggleSiteMenu(false)
                            setDropdownOpen(false)
                        }}
                    />
                </Suspense>
            )}
        </>
    )
}
export default MenuButton
