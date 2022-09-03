import { Hash } from "@phylopic/utils"
import { FC } from "react"
import useSubmission from "~/editing/useSubmission"
import { ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
export type Props = {
    submissionHash: Hash
}
const EditMenu: FC<Props> = ({ submissionHash }) => {
    const submission = useSubmission(submissionHash)
    return (
        <>
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionHash)}/nodes`}
                icon={ICON_PENCIL}
                label={`${submission?.identifier ? "Change": "Set"} Taxonomic Assignment`}
            />
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionHash)}/usage`}
                icon={ICON_PENCIL}
                label={`${submission?.license ? "Change": "Set"} License and Attribution`}
            />
        </>
    )
}
export default EditMenu
