import { isPublicDomainLicenseURL, normalizeText, UUID } from "@phylopic/utils"
import { FC, FormEvent, useCallback, useMemo, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserInput from "~/ui/UserInput"
export interface Props {
    uuid: UUID
}
const Attribution: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const mutate = useImageMutator(uuid)
    const { attribution, license } = image ?? {}
    const required = useMemo(() => !isPublicDomainLicenseURL(license), [license])
    const [value, setValue] = useState<string>(attribution ?? "")
    const normalized = useMemo(() => normalizeText(value), [value])
    const submit = useCallback(() => {
        if (normalized || !required) {
            mutate({ attribution: normalized || null })
        }
    }, [mutate, normalized, required])
    const handleFormSubmit = useCallback(
        (event: FormEvent) => {
            event.preventDefault()
            submit()
        },
        [submit],
    )
    return (
        <>
            <Speech mode="system">
                <p>
                    Who gets the credit for this?
                    {!required && (
                        <>
                            {" "}
                            <small>(Optional.)</small>
                        </>
                    )}
                </p>
            </Speech>
            {!image?.attribution && (
                <form onSubmit={handleFormSubmit}>
                    <Speech mode="user">
                        <SpeechStack compact fullWidth>
                            <span>By&nbsp;</span>
                            <UserInput
                                maxLength={192}
                                onChange={setValue}
                                onBlur={submit}
                                required={required}
                                placeholder="Attribution"
                            />
                            .
                        </SpeechStack>
                    </Speech>
                </form>
            )}
            {image?.attribution && (
                <Speech mode="user">
                    <p>{image.attribution || "Nobody"}.</p>
                </Speech>
            )}
        </>
    )
}
export default Attribution
