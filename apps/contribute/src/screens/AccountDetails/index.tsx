import { useCallback, useState } from "react"
import useContributorMutator from "~/profile/useContributorMutator"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import UserNameForm from "~/ui/UserNameForm"
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
    }, [name, showEmailAddress])
    return (
        <Dialogue>
            <Speech mode="system">
                <p>
                    <strong>Welcome!</strong> What should we call you here?
                </p>
            </Speech>
            {!name && <UserNameForm value={name} onSubmit={setName} />}
            {name && (
                <>
                    <Speech mode="user">
                        <p>
                            My name is <strong>{name}</strong>.
                        </p>
                    </Speech>
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
