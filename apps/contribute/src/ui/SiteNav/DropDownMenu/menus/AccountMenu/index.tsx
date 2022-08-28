import { FC } from "react"
import useContributorUUID from "~/profile/useContributorUUID"
import { ICON_HAND_POINT_RIGHT, ICON_X } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
const AccountMenu: FC = () => {
    const contributorUUID = useContributorUUID()
    return (
        <>
            <MenuLink href="/profile" icon={ICON_HAND_POINT_RIGHT} label="Profile" />
            {contributorUUID && (
                <MenuLink
                    href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/contributors/${encodeURIComponent(
                        contributorUUID,
                    )}`}
                    icon={ICON_HAND_POINT_RIGHT}
                    isExternal
                    label="Your Page on the Site"
                />
            )}
            <MenuLink href="/logout" icon={ICON_X} label="Sign Out" />
        </>
    )
}
export default AccountMenu
