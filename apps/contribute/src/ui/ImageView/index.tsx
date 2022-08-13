import { Node } from "@phylopic/api-models"
import { LicenseURL, LICENSE_NAMES } from "@phylopic/utils"
import { FC } from "react"
import FileView from "../FileView"
import NameView from "../NameView"
import styles from "./index.module.scss"
export type Props = {
    attribution?: string | null
    license?: LicenseURL | null
    onEdit?: (section: "file" | "nodes" | "usage") => void
    general?: Node
    specific?: Node
    src?: string
}
const ImageView: FC<Props> = ({ attribution, general, license, onEdit, specific, src }) => {
    return (
        <section className={styles.main}>
            <figure>
                {src && <FileView mode="light" src={src} />}
                {onEdit && (
                    <figcaption>
                        <a
                            className={styles.edit}
                            onClick={() => onEdit("file")}
                            title={src ? "Change Image" : "Upload Image"}
                        >
                            {src ? "✎" : "↑"}
                        </a>
                    </figcaption>
                )}
            </figure>
            <dl>
                <dt>License</dt>
                <dd>
                    {license && (
                        <a href={license} className="text" target="_blank" rel="noopener noferrer">
                            {LICENSE_NAMES[license] ?? "[Unknown License]"}
                        </a>
                    )}
                    {onEdit && (
                        <a
                            className={styles.edit}
                            onClick={() => onEdit("usage")}
                            title={license ? "Change License" : "Select License"}
                        >
                            {license ? "✎" : "＋"}
                        </a>
                    )}
                </dd>
                <dt>Attribution</dt>
                <dd>
                    {attribution !== undefined && <span>by {attribution || "[Anonymous]"}</span>}
                    {onEdit && (
                        <a
                            className={styles.edit}
                            onClick={() => onEdit("usage")}
                            title={attribution ? "Change Attribution" : "Add Attribution"}
                        >
                            {attribution ? "✎" : "＋"}
                        </a>
                    )}
                </dd>
                <dt>Taxon Depicted</dt>
                <dd>
                    {specific ? <NameView value={specific.names[0]} /> : <span>[None Selected]</span>}
                    {onEdit && (
                        <a className={styles.edit} onClick={() => onEdit("nodes")}>
                            {specific ? "✎" : "＋"}
                        </a>
                    )}
                </dd>
                {general && (
                    <>
                        <dt>Ancestor Stand-In For</dt>
                        <dd>
                            <NameView value={general.names[0]} />
                        </dd>
                    </>
                )}
            </dl>
        </section>
    )
}
export default ImageView
