"use client"
import React from "react"
import { PropagateLoader } from "react-spinners"
import { LoaderContext } from "../LoaderContext"
export const Loader: React.FC = () => {
    const props = React.useContext(LoaderContext)
    return (
        <div style={{ margin: "1rem", textAlign: "center" }}>
            <PropagateLoader color="#000" loading size={15} speedMultiplier={1} {...props} />
        </div>
    )
}
