import React, { useContext, FC } from "react"
import Context from "~/contexts/SubmissionEditorContainer/Context"
import LicenseURLEditor from "../LicenseURLEditor"

const LicenseEditor: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    if (!state || !dispatch) {
        return null
    }
    return (
        <LicenseURLEditor
            onChange={value => dispatch({ payload: value, type: "SET_LICENSE" })}
            modified={state.modified.contribution.license}
            original={state.original.contribution.license}
        />
    )
}
export default LicenseEditor
