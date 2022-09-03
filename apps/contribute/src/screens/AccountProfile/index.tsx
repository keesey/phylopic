import { FC, useCallback, useState } from "react"
import useContributorMutator from "~/profile/useContributorMutator"
import useContributorSWR from "~/profile/useContributorSWR"
import Dialogue from "~/ui/Dialogue"
import { ICON_CHECK, ICON_PENCIL, ICON_X } from "~/ui/ICON_SYMBOLS"
import UserTextForm from "~/ui/UserTextForm"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserInput from "~/ui/UserInput"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import ErrorState from "../ErrorState"
import LoadingState from "../LoadingState"
const AccountProfile: FC = () => {
    const { data: contributor, error } = useContributorSWR()
    const mutate = useContributorMutator()
    const [nameChangeRequested, setNameChangeRequested] = useState(false)
    const handleNameFormSubmit = useCallback(
        (name: string) => {
            mutate({ name })
            setNameChangeRequested(false)
        },
        [mutate],
    )
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
    return (
        <Dialogue>
            <Speech mode="user">
                <p>
                    My name is <strong>{contributor.name}</strong>. My email address is{" "}
                    <strong>
                        <i>
                            <a href={`mailto:${contributor.emailAddress}?subject=Stop+emailing+yourself.`}>
                                {contributor.emailAddress}
                            </a>
                        </i>
                    </strong>
                    , and I
                    {!contributor.showEmailAddress && (
                        <>
                            {" "}
                            <strong>do not</strong>
                        </>
                    )}{" "}
                    want it {contributor.showEmailAddress ? <strong>shown</strong> : "shown"} on the site.
                </p>
            </Speech>
            <Speech mode="system">
                <p>Anything you want to change?</p>
            </Speech>
            {!nameChangeRequested && (
                <UserOptions>
                    <UserButton icon={ICON_PENCIL} onClick={() => setNameChangeRequested(true)}>
                        My name.
                    </UserButton>
                    {contributor.showEmailAddress && (
                        <UserButton icon={ICON_X} onClick={() => mutate({ showEmailAddress: false })}>
                            Hide my email address on the site.
                        </UserButton>
                    )}
                    {!contributor.showEmailAddress && (
                        <UserButton icon={ICON_CHECK} onClick={() => mutate({ showEmailAddress: true })}>
                            Show my email address on the site.
                        </UserButton>
                    )}
                    <UserLinkButton icon={ICON_CHECK} href="/">
                        Nope, looks good.
                    </UserLinkButton>
                </UserOptions>
            )}
            {nameChangeRequested && (
                <>
                    <Speech mode="user">
                        <p>My name.</p>
                    </Speech>
                    <Speech mode="system">
                        <p>It&rsquo;s not &ldquo;{contributor.name}&rdquo;? What is it?</p>
                    </Speech>
                    <UserTextForm editable value="" onSubmit={handleNameFormSubmit}>
                        {(value, setValue) => (
                            <UserInput
                                autoComplete="name"
                                id="name"
                                maxLength={128}
                                name="name"
                                onChange={setValue}
                                placeholder="Full Name or Alias"
                                required
                                type="text"
                                value={value}
                            />
                        )}
                    </UserTextForm>
                    <UserOptions>
                        <UserButton icon={ICON_X} onClick={() => setNameChangeRequested(false)}>
                            Never mind, that is my name.
                        </UserButton>
                    </UserOptions>
                </>
            )}
        </Dialogue>
    )
}
export default AccountProfile
