import { FC } from "react"
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
            {/* :TODO: icon */}
            <NameView value={value.name} />
        </UserButton>
    )
}
export default EntryButton
