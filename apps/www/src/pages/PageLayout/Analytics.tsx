import { FC } from "react";
const Analytics: FC = () => process.env.NODE_ENV === "production" ? (
    <>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YVWGCB3SJ1"></script>
        <script
            dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YVWGCB3SJ1')`
            }}
        />
    </>
) : null
export default Analytics
