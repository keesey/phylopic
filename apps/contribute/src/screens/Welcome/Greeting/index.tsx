import { ContributorContainer } from "@phylopic/ui"
import { FC } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
const Greeting: FC = () => {
    const uuid = useContributorUUID()
    if (!uuid) {
        return null
    }
    return (
        <ContributorContainer uuid={uuid}>
            {contributor => (contributor?.name ? <h2>Hey there, {contributor.name}!</h2> : <h2>Hey there!</h2>)}
        </ContributorContainer>
    )
}
export default Greeting
