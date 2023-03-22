import { shortenNomen, stringifyNomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
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
    const name = specificNodeSWR.data?.names[0]
    const [selection, setSelection] = useState<"delete" | undefined>()
    if (imageSWR.isLoading || specificNodeSWR.isLoading) {
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
                <p>
                    <NameView value={name} defaultText="[Untitled]" />
                    {imageSWR.data?.attribution && ` by ${imageSWR.data?.attribution}`}
                </p>
            </Speech>
            <Speech mode="system">
                <p>Would you like to change something?</p>
            </Speech>
            {!selection && (
                <UserOptions>
                    <UserLinkButton href={`/upload?replace=${encodeURIComponent(uuid)}`}>
                        Upload a revision.
                    </UserLinkButton>
                    <UserButton onClick={() => setSelection("delete")} danger>
                        Remove this from the site.
                    </UserButton>
                </UserOptions>
            )}
            {selection === "delete" && <DeleteImage onCancel={() => setSelection(undefined)} uuid={uuid} />}
        </Dialogue>
    )
}
export default Image
