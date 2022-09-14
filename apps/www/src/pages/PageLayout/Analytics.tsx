import { FC } from "react"
const ID = "YVWGCB3SJ1" // :TODO: env var
const Analytics: FC = () =>
    process.env.NODE_ENV === "production" ? (
        <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${JSON.stringify(
                        ID,
                    )})`,
                }}
            />
        </>
    ) : null
export default Analytics
