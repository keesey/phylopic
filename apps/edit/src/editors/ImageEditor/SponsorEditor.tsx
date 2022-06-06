import { useContext, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
import TextEditor from "~/editors/TextEditor"

const SponsorEditor: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    if (!state || !dispatch) {
        return null
    }
    return (
        <TextEditor
            emptyLabel="N/A"
            onChange={value => dispatch({ payload: value || undefined, type: "SET_SPONSOR" })}
            modified={state.modified.image.sponsor}
            optional
            original={state.original.image.sponsor}
        />
    )
}
export default SponsorEditor
