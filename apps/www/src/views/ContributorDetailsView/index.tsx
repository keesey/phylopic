import { Contributor } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import { FC, useMemo } from "react"
export interface Props {
    value?: Contributor
}
const ContributorDetailsView: FC<Props> = ({ value }) => {
    const contactHRef = value?._links.contact?.href
    const emailAddress = useMemo(() => contactHRef?.replace(/^mailto:/, ""), [contactHRef])
    const emailHRef = useMemo(
        () => (contactHRef ? contactHRef + createSearch({ subject: "Your Silhouette Images on PhyloPic" }) : null),
        [contactHRef],
    )
    if (!emailHRef) {
        return null
    }
    return (
        <table>
            <tbody>
                <tr>
                    <th>Email</th>
                    <td>
                        <a href={emailHRef} rel="external">
                            {emailAddress}
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
export default ContributorDetailsView
