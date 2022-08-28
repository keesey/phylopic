import { FC } from "react"
import { ICON_HAND_POINT_RIGHT } from "~/ui/ICON_SYMBOLS"
import SiteTitle from "~/ui/SiteTitle"
import MenuLink from "../../MenuLink"
const SiteMenu: FC = () => {
    return (
        <>
            <li>
                <h2>
                    <SiteTitle />: Contribute
                </h2>
            </li>
            <MenuLink
                href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}`}
                icon={ICON_HAND_POINT_RIGHT}
                isExternal
                label={
                    <>
                        <SiteTitle /> (Main Site)
                    </>
                }
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
