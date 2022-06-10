import { useContext, FC } from "react"
import Context from "~/contexts/SubmissionEditorContainer/Context"
import TextEditor from "~/editors/TextEditor"

const AttributionEditor: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    if (!state || !dispatch) {
        return null
    }
    return (
        <TextEditor
            emptyLabel="Anonymous"
            onChange={value => dispatch({ payload: value || undefined, type: "SET_ATTRIBUTION" })}
            modified={state.modified.contribution.attribution}
            optional
            original={state.original.contribution.attribution}
        />
    )
}
export default AttributionEditor
