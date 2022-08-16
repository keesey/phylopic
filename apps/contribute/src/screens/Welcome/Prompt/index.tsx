import { FC } from "react"
import SpawnButton from "~/ui/SpawnButton"
import Speech from "~/ui/Speech"
import UserOptions from "~/ui/UserOptions"
const Prompt: FC = () => {
    return (
        <>
            <Speech mode="system">
                <p>Ready to get started?</p>
            </Speech>
            <UserOptions>
                <SpawnButton>Upload a silhouette image.</SpawnButton>
            </UserOptions>
        </>
    )
}
export default Prompt
