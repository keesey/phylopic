import { FC } from "react"
import useContributor from "~/auth/hooks/useContributor"
const Greeting: FC = () => {
    const contributor = useContributor()
    return <h2>Hey there{contributor?.name ? `, ${contributor.name}` : ""}!</h2>
}
export default Greeting
