import { FC } from "react"
import type { TTL } from "../TTLSelector/TTL"
export type Props = {
    value: TTL
}
const TTLView: FC<Props> = ({ value }) => {
    switch (value) {
        case "DAY": {
            return <>24 hours</>
        }
        case "MONTH": {
            return <>30 days</>
        }
        case "QUARTER": {
            return <>90 days</>
        }
        case "WEEK": {
            return <>seven days</>
        }
        case "YEAR": {
            return <>one year</>
        }
        default: {
            return <>24 hours</>
        }
    }
}
export default TTLView
