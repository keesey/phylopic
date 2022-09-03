import { SearchContext } from "@phylopic/ui"
import { FC, useContext } from "react"
import UserTextForm, { Props as UserTextFormProps } from "~/ui/UserTextForm"
import NameRenderer from "../NameRenderer"
import NameInput from "./NameInput"
export type Props = Pick<UserTextFormProps, "postfix" | "prefix">
const NameForm: FC<Props> = props => {
    const [{ text }, dispatch] = useContext(SearchContext) ?? [{}]
    return (
        <UserTextForm
            {...props}
            editable={!text}
            onSubmit={payload => dispatch?.({ type: "SET_TEXT", payload })}
            value={text ?? ""}
            renderer={value => <NameRenderer value={value} />}
        >
            {(value, setValue) => (
                <NameInput onChange={setValue} value={value} placeholder="Species or other taxonomic group" />
            )}
        </UserTextForm>
    )
}
export default NameForm
