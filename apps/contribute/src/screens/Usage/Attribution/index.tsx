import { isPublicDomainLicenseURL, UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import UserTextForm from "~/ui/SiteNav/UserTextForm"
import Speech from "~/ui/Speech"
import UserInput from "~/ui/UserInput"
export interface Props {
    uuid: UUID
}
const Attribution: FC<Props> = ({ uuid }) => {
    const submission = useSubmission(uuid)
    const mutate = useSubmissionMutator(uuid)
    const { attribution, license } = submission ?? {}
    const required = useMemo(() => !isPublicDomainLicenseURL(license), [license])
    const submit = useCallback(
        (value: string) => {
            mutate({ attribution: value || null })
        },
        [mutate],
    )
    return (
        <>
            <Speech mode="system">
                <p>
                    So who gets the credit for this?
                    {!required && (
                        <>
                            {" "}
                            <small>(Optional.)</small>
                        </>
                    )}
                </p>
            </Speech>
            <UserTextForm
                editable={!attribution}
                onSubmit={submit}
                value={attribution ?? ""}
                prefix={<>By&nbsp;</>}
                postfix="."
                renderer={value => (value ? <strong>{value}</strong> : "[Anonymous]")}
            >
                {(value, setValue) => (
                    <UserInput
                        maxLength={192}
                        onChange={setValue}
                        required={required}
                        placeholder="Attribution"
                        value={value}
                    />
                )}
            </UserTextForm>
        </>
    )
}
export default Attribution
