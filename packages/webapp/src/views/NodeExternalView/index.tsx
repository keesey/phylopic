import { TitledLink } from "@phylopic/api-models"
import { compareStrings } from "@phylopic/utils/dist/comparison"
import { FC, useMemo } from "react"
import ExternalTitledLinkView from "../ExternalTitledLinkView"
import LinkedAuthorizedNamespaceView from "../LinkedAuthorizedNamespaceView"
import styles from "./index.module.scss"
export interface Props {
    value: readonly TitledLink[]
    short?: boolean
}
const NodeExternalView: FC<Props> = ({ value, short }) => {
    const categories = useMemo(
        () =>
            value.reduce<Readonly<Record<string, Readonly<Record<string, TitledLink>>>>>((prev, link) => {
                const [authority, namespace, objectID] = link.href.replace(/^\/resolve\//, "").split("/", 3)
                const authorizedNamespace = authority + "/" + namespace
                return {
                    ...prev,
                    [authorizedNamespace]: {
                        ...prev[authorizedNamespace],
                        [objectID]: link,
                    },
                }
            }, {}),
        [value],
    )
    if (!value.length) {
        return null
    }
    return (
        <table>
            <tbody>
                {Object.entries(categories)
                    .sort(([a], [b]) => compareStrings(a, b))
                    .map(([authorizedNamespace, objects]) => (
                        <tr key={authorizedNamespace}>
                            <th className={styles.header}>
                                <LinkedAuthorizedNamespaceView value={authorizedNamespace} short={short} />
                            </th>
                            <td>
                                <ul className={styles.list}>
                                    {Object.entries(objects)
                                        .sort(([a], [b]) => compareStrings(a, b))
                                        .map(([objectID, link]) => (
                                            <li key={objectID} className={styles.item}>
                                                <ExternalTitledLinkView value={link} title={objectID} />
                                            </li>
                                        ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}
export default NodeExternalView
