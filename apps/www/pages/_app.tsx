import { LoaderContext } from "@phylopic/ui"
import type { AppProps } from "next/app"
import React from "react"
import "../src/styles/globals.scss"
const App = ({ Component, pageProps }: AppProps) => {
    return (
        <LoaderContext.Provider value={{ color: "#00809f" }}>
            <Component {...pageProps} />
        </LoaderContext.Provider>
    )
}
export default App
