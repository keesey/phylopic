import type { NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const Page: NextPage = () => (
    <PageLayout head={{ title: "PhyloPic: Incertae Sedis" }}>
        <Dialogue>
            <Speech mode="system">
                <p>I think we got a little lost.</p>
            </Speech>
            <UserOptions>
                <UserLinkButton href="/">Start over.</UserLinkButton>
            </UserOptions>
        </Dialogue>
    </PageLayout>
)
export default Page
