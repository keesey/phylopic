import { UUID } from "@phylopic/utils"
import { FC } from "react"
import { ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
export type Props = {
    submissionUUID: UUID
}
const EditMenu: FC<Props> = ({ submissionUUID }) => {
    return (
        <>
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionUUID)}/file`}
                icon={ICON_PENCIL}
                label="Change Image File"
            />
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionUUID)}/nodes`}
                icon={ICON_PENCIL}
                label="Change Taxonomic Assignment"
            />
            <MenuLink
                href={`/edit/${encodeURIComponent(submissionUUID)}/usage`}
                icon={ICON_PENCIL}
                label="Change Attribution"
            />
        </>
    )
}
export default EditMenu
