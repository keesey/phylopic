import { FC, FormEvent, ReactNode, useCallback, useEffect, useState } from "react"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
export type Props = {
    children: (value: string, setValue: (value: string) => void) => ReactNode
    editable: boolean
    onSubmit: (value: string) => void
    postfix?: ReactNode
    prefix?: ReactNode
    renderer?: (value: string) => ReactNode
    value: string
}
export const DEFAULT_RENDERER: (value: string) => ReactNode = value => <strong>{value}</strong>
const UserTextForm: FC<Props> = ({
    children,
    editable,
    onSubmit,
    postfix,
    prefix,
    renderer = DEFAULT_RENDERER,
    value,
}) => {
    return editable ? (
        <Editable onSubmit={onSubmit} postfix={postfix} prefix={prefix} value={value}>
            {children}
        </Editable>
    ) : (
        <Speech mode="user">
            <SpeechStack compact fullWidth>
                {prefix}
                {renderer(value)}
                {postfix}
            </SpeechStack>
        </Speech>
    )
}
export default UserTextForm
const Editable: FC<Pick<Props, "children" | "onSubmit" | "postfix" | "prefix" | "value">> = ({
    children,
    onSubmit,
    postfix,
    prefix,
    value,
}) => {
    const [textValue, setTextValue] = useState(value)
    const submit = useCallback(
        (event: FormEvent) => {
            event.preventDefault()
            onSubmit(textValue)
        },
        [onSubmit, textValue],
    )
    return (
        <form onSubmit={submit} onBlur={submit}>
            <Speech mode="user-input">
                <SpeechStack compact fullWidth>
                    {prefix}
                    {children(textValue, setTextValue)}
                    {postfix}
                </SpeechStack>
            </Speech>
        </form>
    )
}
