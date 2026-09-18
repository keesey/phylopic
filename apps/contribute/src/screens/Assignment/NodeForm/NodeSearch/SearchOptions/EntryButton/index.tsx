import type { FC } from "react"
import NameView from "~/ui/NameView"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import type { SearchEntry } from "../../SearchEntry"
import Icon from "./Icon"

export type Props = {
    onClick?: () => void
    value: SearchEntry
}

const EntryButton: FC<Props> = ({ onClick, value }) => {
    return (
        <UserButton onClick={onClick}>
            <SpeechStack>
                <Icon value={value} />
                <NameView value={value.name} />
            </SpeechStack>
        </UserButton>
    )
}

export default EntryButton
