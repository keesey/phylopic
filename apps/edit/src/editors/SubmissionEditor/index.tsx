import { Hash } from "@phylopic/utils"
import { FC } from "react"
import AttributionEditor from "./AttributionEditor"
import ContributorViewer from "./ContributorViewer"
import Controls from "./Controls"
import styles from "./index.module.scss"
import LicenseEditor from "./LicenseEditor"
import IdentifierViewer from "./IdentifierViewer"
import SponsorEditor from "./SponsorEditor"
export type Props = {
    hash: Hash
}
const SubmissionEditor: FC<Props> = ({ hash }) => {
    return (
        <section className={styles.main}>
            <dl>
                <dt>Attribution</dt>
                <dd>
                    <AttributionEditor hash={hash} />
                </dd>
                <dt>Contributor</dt>
                <dd>
                    <ContributorViewer hash={hash} />
                </dd>
                <dt>Sponsor</dt>
                <dd>
                    <SponsorEditor hash={hash} />
                </dd>
                <dt>License</dt>
                <dd>
                    <LicenseEditor hash={hash} />
                </dd>
                <dt>Identifier</dt>
                <dd>
                    <IdentifierViewer hash={hash} />
                </dd>
            </dl>
            <Controls hash={hash} />
        </section>
    )
}
export default SubmissionEditor
