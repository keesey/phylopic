"use client"
import { useState } from "react"
import { Drawer } from "~/components/Drawer"

const Controls = ({ params }: { params: { code: string } }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <button onClick={() => setOpen(!open)} disabled={open}>
                ⓘ
            </button>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <header>
                    <h2>Rules</h2>
                </header>
            </Drawer>
        </>
    )
}
export default Controls
