import { FC } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { ICON_BOX, ICON_CHECK } from "~/ui/ICON_SYMBOLS"
import MenuLink from "../../MenuLink"
const ViewMenu: FC = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data: numImages } = useSWR("/api/images?total=items", fetcher)
    const { data: numSubmissions } = useSWR("/api/submissions?total=items", fetcher)
    return (
        <>
            <MenuLink disabled={!numSubmissions} icon={ICON_BOX} href="/submissions" label="Current Submissions" />
            <MenuLink disabled={!numImages} icon={ICON_CHECK} href="/images" label="Accepted Submissions" />
        </>
    )
}
export default ViewMenu
