import { Image as APIImage } from "@phylopic/api-models"
import { shortenNomen, stringifyNomen, UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { FC, useState } from "react"
import slugify from "slugify"
import useSWRImmutable from "swr/immutable"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_DANGER, ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import ErrorState from "../ErrorState"
import LoadingState from "../LoadingState"
import DeleteImage from "./DeleteImage"
import useImage from "./useImage"
import useNode from "./useNode"
export type Props = {
    uuid: UUID
}
const Image: FC<Props> = ({ uuid }) => {
    const imageSWR = useImage(uuid)
    const specificNodeSWR = useNode(imageSWR.data?.specific)
    const apiFetcher = useAPIFetcher<APIImage>()
    const publishedSWR = useSWRImmutable(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(uuid)}`,
        apiFetcher,
    )
    const name = specificNodeSWR.data?.names[0]
    const [selection, setSelection] = useState<"delete" | undefined>()
    const isPublished = publishedSWR.isLoading ? undefined : !publishedSWR.error
    if (imageSWR.isLoading || specificNodeSWR.isLoading || publishedSWR.isLoading) {
        return <LoadingState>One moment…</LoadingState>
    }
    if (imageSWR.error ?? specificNodeSWR.error) {
        return <ErrorState>{String(imageSWR.error ?? specificNodeSWR.error)}</ErrorState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <FileView
                    alt={stringifyNomen(shortenNomen(name ?? []))}
                    src={`/api/images/${encodeURIComponent(uuid)}/file`}
                    mode="light"
                />
                <br />
                <p>
                    <NameView value={name} defaultText="[Untitled]" />
                    {imageSWR.data?.attribution && ` by ${imageSWR.data?.attribution}`}
                </p>
            </Speech>
            <Speech mode="system">
                <p>
                    <strong>Nice work!</strong>{" "}
                    {isPublished ? (
                        <>
                            It looks great{" "}
                            <a
                                href={`${process.env.NEXT_PUBLIC_WWW_URL}/images/${encodeURIComponent(uuid)}/${slugify(
                                    publishedSWR.data?._links.self.title ?? "",
                                    {
                                        lower: true,
                                        strict: true,
                                    },
                                )}`}
                            >
                                on the site
                            </a>
                            .
                        </>
                    ) : (
                        <>It&rsquo;s been approved for the next site update.</>
                    )}
                </p>
                <p>Would you like to change something?</p>
            </Speech>
            {!selection && (
                <UserOptions>
                    <UserLinkButton icon={ICON_PENCIL} href={`/upload?replace=${encodeURIComponent(uuid)}`}>
                        Upload a revision.
                    </UserLinkButton>
                    <UserButton icon={ICON_DANGER} onClick={() => setSelection("delete")} danger>
                        Delete this {isPublished ? "from" : "before it goes to"} the site.
                    </UserButton>
                </UserOptions>
            )}
            {selection === "delete" && <DeleteImage onCancel={() => setSelection(undefined)} uuid={uuid} />}
        </Dialogue>
    )
}
export default Image
