import { Submission } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import Link from "next/link"
import { FC } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import Paginator from "~/pagination/Paginator"
import NumberAsWords from "~/ui/NumberAsWords"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import UserSubmissionThumbnail from "~/ui/UserSubmissionThumbnail"
const Submissions: FC = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data: numImages } = useSWR("/api/images?total=items", fetcher)
    const { data: numSubmissions } = useSWR("/api/submissions?total=items", fetcher)
    return (
        <>
            <Speech mode="system">
                {typeof numSubmissions === "number" ? (
                    <p>
                        You have{" "}
                        <strong>
                            <NumberAsWords max={100} value={numSubmissions} />
                        </strong>{" "}
                        unreviewed submission{numSubmissions === 1 ? "" : "s"}. There&rsquo;s still time to make
                        revisions, if you need to&mdash;just click on the image.
                    </p>
                ) : (
                    <>
                        <p>Checking for submissions&hellip;</p>
                        <Loader />
                    </>
                )}
                {typeof numImages === "number" && numImages > 0 && (
                    <p>
                        You also have{" "}
                        <Link href="/images">
                            <strong>
                                <NumberAsWords max={100} value={numImages} />
                            </strong>{" "}
                            accepted submission{numImages === 1 ? "" : "s"}
                        </Link>
                        .
                    </p>
                )}
            </Speech>
            <UserOptions noAutoScroll>
                <Paginator endpoint="/api/submissions">
                    {submissions =>
                        (submissions as ReadonlyArray<Submission & { Key: string }>).map(({ Key }) => {
                            const hash = Key.split("/").pop()
                            if (!hash) {
                                return null
                            }
                            return (
                                <UserLinkButton key={hash} href={`/edit/${encodeURIComponent(hash)}`}>
                                    <UserSubmissionThumbnail hash={hash} />
                                </UserLinkButton>
                            )
                        })
                    }
                </Paginator>
            </UserOptions>
        </>
    )
}
export default Submissions
