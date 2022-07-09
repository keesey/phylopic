import dynamic from "next/dynamic"
import React from "react"
import { LoaderContext } from "../LoaderContext"
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"), { ssr: false })
export const Loader: React.FC = () => {
    const props = React.useContext(LoaderContext)
    return (
        <div style={{ textAlign: "center" }}>
            <PropagateLoader color="#000" css="" loading size={15} speedMultiplier={1} {...props} />
        </div>
    )
}
export default Loader
