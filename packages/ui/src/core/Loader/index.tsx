import dynamic from "next/dynamic"
import React from "react"
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"), { ssr: false })
export type LoaderProps = {
    color?: string
}
export const Loader: React.FC<LoaderProps> = ({ color }) => (
    <div style={{ textAlign: "center" }}>
        <PropagateLoader color={color ?? "#000"} css="" loading size={15} speedMultiplier={1} />
    </div>
)
export default Loader
