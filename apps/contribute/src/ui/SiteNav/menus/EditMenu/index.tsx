import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import { ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
export type Props = {
    image: Image & { uuid: UUID }
}
const EditMenu: FC<Props> = ({ image }) => {
    return (
        <>
            <MenuLink href={`/edit/${encodeURIComponent(image.uuid)}/file`} icon={ICON_PENCIL} label="Update File" />
            <MenuLink
                href={`/edit/${encodeURIComponent(image.uuid)}/nodes`}
                icon={ICON_PENCIL}
                label="Change Taxonomic Assignment"
            />
            <MenuLink
                href={`/edit/${encodeURIComponent(image.uuid)}/usage`}
                icon={ICON_PENCIL}
                label="Change License or Attribution"
            />
        </>
    )
}
export default EditMenu
