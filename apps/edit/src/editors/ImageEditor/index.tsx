import { UUID } from "@phylopic/utils"
import { FC } from "react"
import AttributionEditor from "./AttributionEditor"
import ContributorViewer from "./ContributorViewer"
import Controls from "./Controls"
import styles from "./index.module.scss"
import LicenseEditor from "./LicenseEditor"
import SponsorEditor from "./SponsorEditor"
export type Props = {
    uuid: UUID
}
const ImageEditor: FC<Props> = ({ uuid }) => {
    return (
        <section className={styles.main}>
            <dl>
                <dt>Attribution</dt>
                <dd>
                    <AttributionEditor uuid={uuid} />
                </dd>
                <dt>Contributor</dt>
                <dd>
                    <ContributorViewer uuid={uuid} />
                </dd>
                <dt>Sponsor</dt>
                <dd>
                    <SponsorEditor uuid={uuid} />
                </dd>
                <dt>License</dt>
                <dd>
                    <LicenseEditor uuid={uuid} />
                </dd>
                {/*
                <dt>Nodes</dt>
                <dd>
                    <LineageEditor uuid={uuid} />
                </dd>
    */}
            </dl>
            <Controls uuid={uuid} />
        </section>
    )
}
export default ImageEditor
