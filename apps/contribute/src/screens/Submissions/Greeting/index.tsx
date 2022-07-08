import { ContributorContainer } from "@phylopic/ui"
import { FC } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
const Greeting: FC = () => {
    const uuid = useContributorUUID()
    if (!uuid) {
        return null
    }
    return (
        <section className="dialogue">
            <ContributorContainer uuid={uuid}>
                {contributor => (contributor ? <p>Hi, {contributor.name ?? "[Anonymous]"}!</p> : null)}
            </ContributorContainer>
        </section>
    )
}
export default Greeting
