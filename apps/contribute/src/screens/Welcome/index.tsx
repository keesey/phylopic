import { Loader } from "@phylopic/ui"
import { FC, Fragment } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import Greeting from "./Greeting"
import Images from "./Images"
import Prompt from "./Prompt"
import Submissions from "./Submissions"
const Welcome: FC = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data: numImages } = useSWR("/api/images?total=items", fetcher)
    const { data: numSubmissions } = useSWR("/api/submissions?total=items", fetcher)
    const hasImages = typeof numImages === "number" && numImages > 0
    const hasSubmissions = typeof numSubmissions === "number" && numSubmissions > 0
    const pending = numImages === undefined || numSubmissions === undefined
    const hasNothing = !hasImages && !hasSubmissions
    return (
        <Dialogue>
            <Greeting />
            {pending && (
                <Speech mode="system" key="pending">
                    <p>Looking up your images…</p>
                    <Loader />
                </Speech>
            )}
            {!pending && (
                <Fragment key="content">
                    {hasNothing ? <Prompt /> : hasSubmissions ? <Submissions /> : <Images />}
                </Fragment>
            )}
        </Dialogue>
    )
}
export default Welcome
