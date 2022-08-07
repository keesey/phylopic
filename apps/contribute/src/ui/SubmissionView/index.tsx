import { Submission } from "@phylopic/source-models"
import { LICENSE_NAMES } from "@phylopic/utils"
import { FC, ReactNode } from "react"
import FileView from "../FileView"
import NameView from "../NameView"
import styles from "./index.module.scss"
export type Props = {
    header?: ReactNode
    imageSrc: string
    submission: Submission
    onEdit?: (section: "file" | "nodes" | "usage") => void
}
const SubmissionView: FC<Props> = ({ header, imageSrc, onEdit, submission }) => {
    const { attribution, license, general, specific } = submission
    return (
        <section className={styles.main}>
            <header>{header ?? "Image"}</header>
            <figure>
                <FileView mode="light" src={imageSrc} />
                {onEdit && (
                    <figcaption>
                        <a className={styles.edit} onClick={() => onEdit("file")}>
                            Edit
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
                        <a className={styles.edit} onClick={() => onEdit("usage")}>
                            Edit
                        </a>
                    )}
                </dd>
                <dt>Attribution</dt>
                <dd>
                    <span>by {attribution ?? "[Anonymous]"}</span>
                    {onEdit && (
                        <a className={styles.edit} onClick={() => onEdit("usage")}>
                            Edit
                        </a>
                    )}
                </dd>
                <dt>Taxon Depicted</dt>
                <dd>
                    {specific ? <NameView value={specific.name} /> : <span>[None Selected]</span>}
                    {onEdit && (
                        <a className={styles.edit} onClick={() => onEdit("nodes")}>
                            Edit
                        </a>
                    )}
                </dd>
                {general && (
                    <>
                        <dt>Ancestor Stand-In For</dt>
                        <dd>
                            <NameView value={general.name} />
                        </dd>
                    </>
                )}
            </dl>
        </section>
    )
}
export default SubmissionView
