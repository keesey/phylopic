import { FC } from "react"
import { ICON_ARROW_RIGHT, ICON_HAND_POINT_RIGHT } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
const SiteMenu: FC = () => {
    return (
        <>
            <MenuLink href="/" icon={ICON_HAND_POINT_RIGHT} label="Contribute" />
            <MenuLink
                href={process.env.NEXT_PUBLIC_WWW_URL + "/"}
                icon={ICON_ARROW_RIGHT}
                isExternal
                label="Main Site"
            />
            <MenuLink
                href={`${process.env.NEXT_PUBLIC_WWW_URL}/images`}
                icon={ICON_ARROW_RIGHT}
                isExternal
                label="Image Gallery"
            />
        </>
    )
}
export default SiteMenu
