import React, { useContext, FC } from "react"
import Context from "~/contexts/SubmissionEditorContainer/Context"
import EmailAddressEditor from "../EmailAddressEditor"

const ContributorEditor: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    if (!state || !dispatch) {
        return null
    }
    return (
        <EmailAddressEditor
            onChange={value => dispatch({ payload: value, type: "SET_CONTRIBUTOR" })}
            modified={state.modified.contribution.contributor}
            original={state.original.contribution.contributor}
        />
    )
}
export default ContributorEditor
