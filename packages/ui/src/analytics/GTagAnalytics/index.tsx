import { useRouter } from "next/router"
import Script from "next/script"
import { FC, useEffect } from "react"
import gtag from "../gtag"
export type GTagAnalyticsProps = {
    gaMeasurementId?: string
}
export const GTagAnalytics: FC<GTagAnalyticsProps> = ({ gaMeasurementId }) => {
    const router = useRouter()
    useEffect(() => {
        if (gaMeasurementId) {
            const handleRouteChange = (url: string) => gtag.pageview(url, gaMeasurementId)
            router.events.on("routeChangeComplete", handleRouteChange)
            return () => router.events.off("routeChangeComplete", handleRouteChange)
        }
    }, [gaMeasurementId, router.events])
    if (!gaMeasurementId) {
        return null
    }
    return (
        <>
            <Script
                async
                src={`//www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
                id="script:gtag"
                strategy="afterInteractive"
            />
            <Script
                dangerouslySetInnerHTML={{
                    __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${JSON.stringify(
                        gaMeasurementId,
                    )})`,
                }}
                id="script:gtag:init"
            />
        </>
    )
}
