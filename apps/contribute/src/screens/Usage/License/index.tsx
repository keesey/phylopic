import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
export interface Props {
    uuid: UUID
}
const License: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const mutate = useImageMutator(uuid)
    if (!image) {
        return null
    }
    if (image.license) {
        return (
            <>
                <Speech mode="user">
                    <p>
                        <a href={image.license} target="_blank" rel="noopener noferrer">
                            {LICENSE_NAMES[image.license]}
                        </a>
                        .
                    </p>
                </Speech>
                <UserOptions>
                    <UserButton danger onClick={() => mutate({ license: null })}>
                        Pick another license.
                    </UserButton>
                </UserOptions>
            </>
        )
    }
    return (
        <UserOptions>
            <UserButton onClick={() => mutate({ license: "https://creativecommons.org/publicdomain/mark/1.0/" })}>
                This is a preexisting image in the public domain.
            </UserButton>
            <UserButton onClick={() => mutate({ license: "https://creativecommons.org/publicdomain/zero/1.0/" })}>
                Release this work into the public domain.
            </UserButton>
            <UserButton onClick={() => mutate({ license: "https://creativecommons.org/licenses/by/4.0/" })}>
                Attribution should always be given.
            </UserButton>
        </UserOptions>
    )
}
export default License
