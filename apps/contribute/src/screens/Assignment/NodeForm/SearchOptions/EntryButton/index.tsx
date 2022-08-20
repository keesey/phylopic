import { FC } from "react"
import Icon from "./Icon"
import { SearchEntry } from "~/search/SearchEntry"
import NameView from "~/ui/NameView"
import UserButton from "~/ui/UserButton"
export type Props = {
    onClick?: () => void
    value: SearchEntry
}
const EntryButton: FC<Props> = ({ onClick, value }) => {
    return (
        <UserButton onClick={onClick}>
            <Icon value={value} />
            <NameView value={value.name} />
        </UserButton>
    )
}
export default EntryButton
