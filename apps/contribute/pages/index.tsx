import { Loader } from "@phylopic/client-components"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import PageLayout from "~/pages/PageLayout"
const Home = dynamic(() => import("~/pages/Home"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        seo={{
            canonical: process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/",
            description: "Upload your own images to PhyloPic, the open database of freely reusable silhouettes.",
        }}
    >
        <Suspense fallback={<Loader />}>
            <Home />
        </Suspense>
    </PageLayout>
)
export default Page
