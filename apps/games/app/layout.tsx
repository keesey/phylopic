import { PropsWithChildren } from "react"
import "../styles/globals.scss"

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
