import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import Icon from "./Icon"
import styles from "./index.module.scss"
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
            <Speech mode="user">
                <p>
                    The{" "}
                    <a href={image.license} target="_blank" rel="noreferrer">
                        {LICENSE_NAMES[image.license]}
                    </a>{" "}
                    license.
                </p>
            </Speech>
        )
    }
    return (
        <UserOptions>
            <UserButton
                icon={<Icon alt="No Copyright" src="/logos/publicdomain.svg" />}
                onClick={() => mutate({ license: "https://creativecommons.org/publicdomain/mark/1.0/" })}
            >
                It&rsquo;s already in the public domain.
            </UserButton>
            <UserButton
                icon={
                    <span className={styles.iconContainer}>
                        <Icon alt="Creative Commons" src="/logos/cc.svg" />{" "}
                        <Icon alt="Public Domain Dedication" src="/logos/cc-zero.svg" />
                    </span>
                }
                onClick={() => mutate({ license: "https://creativecommons.org/publicdomain/zero/1.0/" })}
            >
                Release it into the public domain.
            </UserButton>
            <UserButton
                icon={
                    <span className={styles.iconContainer}>
                        <Icon alt="Creative Commons" src="/logos/cc.svg" />{" "}
                        <Icon alt="Attribution" src="/logos/cc-by.svg" />
                    </span>
                }
                onClick={() => mutate({ license: "https://creativecommons.org/licenses/by/4.0/" })}
            >
                Attribution should always be given.
            </UserButton>
        </UserOptions>
    )
}
export default License
