import { Nomen } from "@phylopic/utils"
import { FC, Fragment } from "react"
import NomenView from "~/views/NomenView"
export interface Props {
    nomina: readonly Nomen[]
}
const Nomina: FC<Props> = ({ nomina }) => {
    if (!nomina.length) {
        return null
    }
    return (
        <>
            {" "}
            (
            {nomina.map((nomen, index) => (
                <Fragment key={JSON.stringify(nomen)}>
                    {index > 0 && ", "}
                    <NomenView key={JSON.stringify(nomen)} short value={nomen} />
                </Fragment>
            ))}
            )
        </>
    )
}
export default Nomina
