import { useContext, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
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
            modified={state.modified.image.attribution}
            optional
            original={state.original.image.attribution}
        />
    )
}
export default AttributionEditor
