import { FC } from "react"
import useImageCount from "~/editing/useImageCount"
import { ICON_BOX, ICON_CHECK, ICON_ELLIPSIS, ICON_X } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
const ViewMenu: FC = () => {
    const accepted = useImageCount("accepted")
    const incomplete = useImageCount("incomplete")
    const submitted = useImageCount("submitted")
    const withdrawn = useImageCount("withdrawn")
    return (
        <>
            <MenuLink
                disabled={!incomplete}
                icon={ICON_ELLIPSIS}
                href="/images/incomplete"
                label="Submissions in Progress"
            />
            <MenuLink disabled={!submitted} icon={ICON_BOX} href="/images/submitted" label="Submitted Images" />
            <MenuLink disabled={!accepted} icon={ICON_CHECK} href="/images/accepted" label="Accepted Submissions" />
            <MenuLink disabled={!withdrawn} icon={ICON_X} href="/images/withdrawn" label="Withdrawn Images" />
        </>
    )
}
export default ViewMenu
