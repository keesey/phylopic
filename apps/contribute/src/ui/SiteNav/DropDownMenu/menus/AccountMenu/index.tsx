import { FC } from "react"
import { ICON_HAND_POINT_RIGHT, ICON_X } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
const AccountMenu: FC = () => {
    return (
        <>
            <MenuLink href="/profile" icon={ICON_HAND_POINT_RIGHT} label="Profile" />
            <MenuLink href="/logout" icon={ICON_X} label="Sign Out" />
        </>
    )
}
export default AccountMenu
