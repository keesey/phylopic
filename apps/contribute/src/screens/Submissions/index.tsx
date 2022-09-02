import { Submission } from "@phylopic/source-models"
import { FC, ReactNode } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import Paginator from "~/pagination/Paginator"
import Dialogue from "~/ui/Dialogue"
import { ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import UserSubmissionThumbnail from "~/ui/UserSubmissionThumbnail"
export type Props = {
    children: (total: number | undefined) => ReactNode
}
const Submissions: FC<Props> = ({ children }) => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data: total } = useSWR("/api/submissions?total=items", fetcher)
    return (
        <Dialogue>
            <Speech mode="system">{children(total)}</Speech>
            <UserOptions>
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
                {total === 0 && (
                    <UserLinkButton icon={ICON_PLUS} href="/upload">
                        Start a new submission.
                    </UserLinkButton>
                )}
            </UserOptions>
        </Dialogue>
    )
}
export default Submissions
