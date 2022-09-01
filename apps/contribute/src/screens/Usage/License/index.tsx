import { Hash, LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import Icon from "./Icon"
import styles from "./index.module.scss"
export interface Props {
    hash: Hash
}
const License: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    const mutate = useSubmissionMutator(hash)
    if (!submission) {
        return null
    }
    if (submission.license) {
        return (
            <Speech mode="user">
                <p>
                    The{" "}
                    <strong>
                        <a href={submission.license} target="_blank" rel="noreferrer">
                            {LICENSE_NAMES[submission.license]}
                        </a>
                    </strong>{" "}
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
