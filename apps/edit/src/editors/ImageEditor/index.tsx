import { UUID } from "@phylopic/utils"
import { FC } from "react"
import AttributionEditor from "./AttributionEditor"
import ContributorViewer from "./ContributorViewer"
import Controls from "./Controls"
import styles from "./index.module.scss"
import LicenseEditor from "./LicenseEditor"
import ListedEditor from "./ListedEditor"
import NodesEditor from "./NodesEditor"
import SponsorEditor from "./SponsorEditor"
import TagsEditor from "./TagsEditor"
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
                <dt>Listed?</dt>
                <dd>
                    <ListedEditor uuid={uuid} />
                </dd>
                <dt>Tags</dt>
                <dd>
                    <TagsEditor uuid={uuid} />
                </dd>
                <dt>Nodes</dt>
                <dd>
                    <NodesEditor uuid={uuid} />
                </dd>
            </dl>
            <Controls uuid={uuid} />
        </section>
    )
}
export default ImageEditor
