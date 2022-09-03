import { ImageThumbnailView } from "@phylopic/ui"
import { FC } from "react"
import NameView from "~/ui/NameView"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import { SearchEntry } from "../../NodeSearch/SearchEntry"
import AuthorityIcon from "./Icon/AuthorityIcon"
export type Props = {
    onClick?: () => void
    value: SearchEntry
}
const EntryButton: FC<Props> = ({ onClick, value }) => {
    return (
        <UserButton onClick={onClick}>
            <SpeechStack>
                {value.image && <ImageThumbnailView key="icon" value={value.image} />}
                {!value.image && <AuthorityIcon key="icon" authority={value.authority} />}
                <NameView value={value.name} />
            </SpeechStack>
        </UserButton>
    )
}
export default EntryButton
