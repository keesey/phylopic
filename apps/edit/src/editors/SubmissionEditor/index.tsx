import { useContext, FC } from "react"
import Context from "~/contexts/SubmissionEditorContainer/Context"
import AttributionEditor from "./AttributionEditor"
import ContributorEditor from "./ContributorEditor"
import Controls from "./Controls"
import styles from "./index.module.scss"
import LicenseEditor from "./LicenseEditor"
import LineageEditor from "./LineageEditor"
import SponsorEditor from "./SponsorEditor"

const SubmissionEditor: FC = () => {
    const [state] = useContext(Context) ?? []
    const { modified } = state ?? {}
    if (!modified) {
        return null
    }
    const className = [styles.main, state?.pending && "pending"].filter(Boolean).join(" ")
    return (
        <section className={className}>
            <dl>
                <dt>Attribution</dt>
                <dd>
                    <AttributionEditor />
                </dd>
                <dt>Contributor</dt>
                <dd>
                    <ContributorEditor />
                </dd>
                <dt>Sponsor</dt>
                <dd>
                    <SponsorEditor />
                </dd>
                <dt>License</dt>
                <dd>
                    <LicenseEditor />
                </dd>
                <dt>Nodes</dt>
                <dd>
                    <LineageEditor />
                </dd>
            </dl>
            <Controls />
        </section>
    )
}
export default SubmissionEditor
