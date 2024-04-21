import Link from "next/link"
import SiteTitle from "~/components/SiteTitle"
const Title = () => {
    return (
        <Link href="/">
            <SiteTitle /> | Games
        </Link>
    )
}
export default Title
