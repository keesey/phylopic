import dynamic from "next/dynamic"
import { FC } from "react"
const FourCladesRules = dynamic(() => import("~/games/four-clades/rules").then(({ Rules }) => Rules))
export interface Props {
    code?: string
}
export const GameRules: FC<Props> = ({ code }) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesRules />
        }
        default: {
            return <p>Unrecognized game.</p>
        }
    }
}
