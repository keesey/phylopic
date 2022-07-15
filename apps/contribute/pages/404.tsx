import { AnchorLink } from "@phylopic/ui"
import type { NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
const Page: NextPage = () => (
    <PageLayout head={{ title: "PhyloPic: Incertae Sedis" }}>
        <DialogueScreen>
            <p>I think we got a little lost.</p>
            <AnchorLink href="/" className="cta">
                Start Over
            </AnchorLink>
        </DialogueScreen>
    </PageLayout>
)
export default Page
