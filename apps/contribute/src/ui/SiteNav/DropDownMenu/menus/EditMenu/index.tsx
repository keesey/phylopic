import { Hash } from "@phylopic/utils"
import { FC } from "react"
import { ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
export type Props = {
    submissionHash: Hash
}
const EditMenu: FC<Props> = ({ submissionHash }) => {
    return (
        <>
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionHash)}/nodes`}
                icon={ICON_PENCIL}
                label="Change Taxonomic Assignment"
            />
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionHash)}/usage`}
                icon={ICON_PENCIL}
                label="Change Attribution"
            />
        </>
    )
}
export default EditMenu
