import { SearchContext } from "@phylopic/ui"
import { FC, useCallback, useContext } from "react"
import UserTextForm, { Props as UserTextFormProps } from "~/ui/UserTextForm"
import NameRenderer from "../NameRenderer"
import NameInput from "./NameInput"
export type Props = Pick<UserTextFormProps, "editable" | "postfix" | "prefix"> & {
    onChange: (value: string) => void
    placeholder: string
    value: string
}
const NameForm: FC<Props> = ({ onChange, placeholder, value, ...formProps }) => {
    const [, dispatchSearch] = useContext(SearchContext) ?? [{}]
    const handleChange = useCallback(
        (payload: string) => {
            dispatchSearch?.({ type: "SET_TEXT", payload })
            onChange(payload)
        },
        [dispatchSearch, onChange],
    )
    return (
        <UserTextForm {...formProps} renderer={value => <NameRenderer value={value} />} value={value ?? ""}>
            {() => <NameInput onChange={handleChange} placeholder={placeholder} value={value ?? ""} />}
        </UserTextForm>
    )
}
export default NameForm
