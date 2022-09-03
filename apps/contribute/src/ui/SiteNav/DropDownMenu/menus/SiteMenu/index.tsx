import { FC } from "react"
import { ICON_HAND_POINT_RIGHT } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
const SiteMenu: FC = () => {
    return (
        <>
            <MenuLink
                href="/"
                icon={ICON_HAND_POINT_RIGHT}
                label="Contribute"
            />
            <MenuLink
                href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}`}
                icon={ICON_HAND_POINT_RIGHT}
                isExternal
                label="Main Site"
            />
            <MenuLink
                href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images`}
                icon={ICON_HAND_POINT_RIGHT}
                isExternal
                label="Image Gallery"
            />
        </>
    )
}
export default SiteMenu
