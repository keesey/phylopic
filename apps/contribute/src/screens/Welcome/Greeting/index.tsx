import { FC } from "react"
import useContributor from "~/profile/useContributor"
import Speech from "~/ui/Speech"
const Greeting: FC = () => {
    const contributor = useContributor()
    return (
        <Speech mode="system">
            <h2>Hey there{contributor?.name ? `, ${contributor.name}` : ""}!</h2>
        </Speech>
    )
}
export default Greeting
