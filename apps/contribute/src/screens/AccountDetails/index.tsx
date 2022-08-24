import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { ChangeEvent, FC, FormEvent, ReactNode, useCallback, useState } from "react"
import useContributorMutator from "~/profile/useContributorMutator"
import useContributorSWR from "~/profile/useContributorSWR"
import Dialogue from "~/ui/Dialogue"
import { ICON_CHECK, ICON_X } from "~/ui/ICON_SYMBOLS"
import SiteTitle from "~/ui/SiteTitle"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserInput from "~/ui/UserInput"
import UserOptions from "~/ui/UserOptions"
import UserVerification from "~/ui/UserVerification"
import ErrorState from "../ErrorState"
import LoadingState from "../LoadingState"
import styles from "./index.module.scss"
export type Props = {
    children?: ReactNode
    onComplete?: () => void
}
const AccountDetails: FC<Props> = ({ children, onComplete }) => {
    const { data: contributor, error } = useContributorSWR()
    const mutate = useContributorMutator()
    if (error) {
        return (
            <ErrorState>
                <p>I&rsquo;m having some trouble loading your profile. Does this mean anything to you?</p>
                <p>&ldquo;{String(error)}&rdquo;</p>
            </ErrorState>
        )
    }
    if (!contributor) {
        return <LoadingState>Checking account&hellip;</LoadingState>
    }
    const complete = Boolean(contributor.name && contributor.name !== INCOMPLETE_STRING)
    return (
        <Dialogue>
            {children}
            <Speech mode="user">
                <SpeechStack compact fullWidth>
                    <span className={styles.nameLabel}>My name is&nbsp;</span>
                    <UserInput
                        autoComplete="name"
                        id="name"
                        maxLength={128}
                        name="name"
                        onChange={name => mutate({ name })}
                        placeholder="Full Name, or Alias"
                        required
                        type="text"
                        value={contributor.name}
                    />
                    <span>.</span>
                </SpeechStack>
            </Speech>
            <Speech mode="system">
                <p>
                    Do you want your email address to be visible?
                    {complete && <> (Currently it is {!contributor.showEmailAddress && " not"}shown.)</>}
                </p>
            </Speech>
            <UserOptions>
                <UserButton icon={ICON_CHECK} onClick={() => mutate({ showEmailAddress: true })}>
                    Show my email address.
                </UserButton>
                <UserButton danger icon={ICON_X} onClick={() => mutate({ showEmailAddress: false })}>
                    Hide my email address.
                </UserButton>
                {complete && onComplete && (
                    <UserButton icon={ICON_CHECK} onClick={onComplete}>
                        All set.
                    </UserButton>
                )}
            </UserOptions>
        </Dialogue>
    )
}
export default AccountDetails
