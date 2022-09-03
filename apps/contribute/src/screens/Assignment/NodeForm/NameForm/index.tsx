import { SearchContext } from "@phylopic/ui"
import { FC, useContext } from "react"
import UserTextForm, { Props as UserTextFormProps } from "~/ui/UserTextForm"
import NameRenderer from "../NameRenderer"
import NameInput from "./NameInput"
export type Props = Pick<UserTextFormProps, "postfix" | "prefix"> & {
    placeholder: string
}
const NameForm: FC<Props> = ({ placeholder, ...formProps }) => {
    const [{ text }, dispatch] = useContext(SearchContext) ?? [{}]
    return (
        <UserTextForm
            {...formProps}
            editable={!text}
            onSubmit={payload => dispatch?.({ type: "SET_TEXT", payload })}
            value={text ?? ""}
            renderer={value => <NameRenderer value={value} />}
        >
            {(value, setValue) => <NameInput onChange={setValue} value={value} placeholder={placeholder} />}
        </UserTextForm>
    )
}
export default NameForm
