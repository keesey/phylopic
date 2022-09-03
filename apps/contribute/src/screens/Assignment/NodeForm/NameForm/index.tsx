import { SearchContext } from "@phylopic/ui"
import { FC, useContext, useEffect, useState } from "react"
import UserTextForm, { Props as UserTextFormProps } from "~/ui/UserTextForm"
import NameRenderer from "../NameRenderer"
import NameInput from "./NameInput"
export type Props = Pick<UserTextFormProps, "postfix" | "prefix"> & {
    placeholder: string
}
const NameForm: FC<Props> = ({ placeholder, ...formProps }) => {
    const [editable, setEditable] = useState(true)
    const [{ text }] = useContext(SearchContext) ?? [{}]
    useEffect(() => {
        if (!text) {
            setEditable(true)
        }
    }, [text])
    return (
        <UserTextForm
            {...formProps}
            editable={editable}
            onSubmit={value => setEditable(Boolean(value))}
            value={text ?? ""}
            renderer={value => <NameRenderer value={value} />}
        >
            {() => <NameInput placeholder={placeholder} />}
        </UserTextForm>
    )
}
export default NameForm
