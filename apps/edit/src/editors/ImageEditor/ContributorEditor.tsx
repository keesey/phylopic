import { useContext, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
import EmailAddressEditor from "../EmailAddressEditor"

const ContributorEditor: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    if (!state || !dispatch) {
        return null
    }
    return (
        <EmailAddressEditor
            onChange={value => dispatch({ payload: value, type: "SET_CONTRIBUTOR" })}
            modified={state.modified.image.contributor}
            original={state.original.image.contributor}
        />
    )
}
export default ContributorEditor
