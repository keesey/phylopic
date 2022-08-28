import { UUID } from "@phylopic/utils"
import clsx from "clsx"
import { useContext, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
import AttributionEditor from "./AttributionEditor"
import ContributorEditor from "./ContributorEditor"
import Controls from "./Controls"
import styles from "./index.module.scss"
import LicenseEditor from "./LicenseEditor"
import LineageEditor from "./LineageEditor"
import SponsorEditor from "./SponsorEditor"
export type Props = {
    uuid: UUID
}
const ImageEditor: FC<Props> = () => {
    const [state] = useContext(Context) ?? []
    const { modified } = state ?? {}
    if (!modified) {
        return null
    }
    return (
        <section className={clsx(styles.main, state?.pending && "pending")}>
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
export default ImageEditor
