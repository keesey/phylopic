"use client"
import { useState } from "react"
import { Drawer } from "~/components/Drawer"

const Controls = ({ params }: { params: { code: string } }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <button onClick={() => setOpen(true)} disabled={open}>
                ⓘ
            </button>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <p>
                    <h2>Rules</h2>
                </p>
            </Drawer>
        </>
    )
}
export default Controls
