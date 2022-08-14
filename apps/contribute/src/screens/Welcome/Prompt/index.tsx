import { FC } from "react"
import ButtonNav from "~/ui/ButtonNav"
import SpawnLink from "~/ui/SpawnLink"
const Prompt: FC = () => {
    return (
        <>
            <p>Ready to get started?</p>
            <ButtonNav mode="horizontal">
                <SpawnLink>
                    <button className="cta">Upload a silhouette image.</button>
                </SpawnLink>
            </ButtonNav>
        </>
    )
}
export default Prompt
