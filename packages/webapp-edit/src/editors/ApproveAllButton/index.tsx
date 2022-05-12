import { useRouter } from "next/router"
import React, { useCallback, useState, FC } from "react"
export interface Props {
    contributor: string
}
const ApproveAllButton: FC<Props> = ({ contributor }) => {
    const [pending, setPending] = useState(false)
    const router = useRouter()
    const handleClick = useCallback(() => {
        if (confirm("Are you sure you want to approve all of this contributor's submissions?")) {
            setPending(true)
            ;(async () => {
                try {
                    const response = await fetch(`/api/submissions/${encodeURIComponent(contributor)}/approve`, {
                        method: "POST",
                    })
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                } catch (e) {
                    alert(e)
                } finally {
                    setPending(false)
                    router.push("/submissions")
                }
            })()
        }
    }, [contributor, router])
    return (
        <button disabled={pending} onClick={handleClick}>
            Approve All
        </button>
    )
}
export default ApproveAllButton
