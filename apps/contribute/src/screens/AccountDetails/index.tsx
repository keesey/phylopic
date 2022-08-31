import { useCallback, useState } from "react"
import useContributorMutator from "~/profile/useContributorMutator"
import Dialogue from "~/ui/Dialogue"
import NoBreak from "~/ui/NoBreak"
import UserTextForm from "~/ui/UserTextForm"
import Speech from "~/ui/Speech"
import UserInput from "~/ui/UserInput"
import UserVerification from "~/ui/UserVerification"
const AccountDetails = () => {
    const mutate = useContributorMutator()
    const [name, setName] = useState("")
    const [showEmailAddress, setShowEmailAddress] = useState<boolean | null>(null)
    const clear = useCallback(() => {
        setName("")
        setShowEmailAddress(null)
    }, [])
    const submit = useCallback(() => {
        if (name && showEmailAddress !== null) {
            mutate({ name, showEmailAddress })
        }
    }, [mutate, name, showEmailAddress])
    return (
        <Dialogue>
            <Speech mode="system">
                <p>
                    <strong>Welcome!</strong> What should we call you here?
                </p>
            </Speech>
            <UserTextForm
                editable={name === ""}
                value={name}
                onSubmit={setName}
                prefix={<NoBreak>My name is </NoBreak>}
                postfix="."
            >
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
            {name && (
                <>
                    <Speech mode="system">
                        <p>Nice to meet you. Do you want your email address to be shown on the site?</p>
                    </Speech>
                    <UserVerification
                        affirmation="Yes, I want people to be able to contact me."
                        affirmed={showEmailAddress}
                        denial="No, hide my email address."
                        onAffirm={() => setShowEmailAddress(true)}
                        onDeny={() => setShowEmailAddress(false)}
                    />
                    {showEmailAddress !== null && (
                        <>
                            <Speech mode="system">
                                <p>Got it. All set, then?</p>
                            </Speech>
                            <UserVerification
                                affirmation="Yes, I’m ready to upload some silhouettes!"
                                affirmed={null}
                                denial="Wait, I entered my name wrong."
                                onAffirm={submit}
                                onDeny={clear}
                            />
                        </>
                    )}
                </>
            )}
        </Dialogue>
    )
}
export default AccountDetails
