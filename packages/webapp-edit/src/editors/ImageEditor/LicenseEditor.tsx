import React, { useContext, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
import LicenseURLEditor from "../LicenseURLEditor"

const LicenseEditor: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    if (!state || !dispatch) {
        return null
    }
    return (
        <LicenseURLEditor
            onChange={value => dispatch({ payload: value, type: "SET_LICENSE" })}
            modified={state.modified.image.license}
            original={state.original.image.license}
        />
    )
}
export default LicenseEditor
