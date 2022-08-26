import { isPublicDomainLicenseURL, UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import UserTextForm from "~/ui/SiteNav/UserTextForm"
import Speech from "~/ui/Speech"
import UserInput from "~/ui/UserInput"
export interface Props {
    uuid: UUID
}
const Attribution: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const mutate = useImageMutator(uuid)
    const { attribution, license } = image ?? {}
    const required = useMemo(() => !isPublicDomainLicenseURL(license), [license])
    const submit = useCallback(
        (value: string) => {
            mutate({ attribution: value || null })
        },
        [mutate, required],
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
