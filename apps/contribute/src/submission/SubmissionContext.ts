import { UUID } from "@phylopic/utils"
import { createContext } from "react"
const SubmissionContext = createContext<Readonly<[UUID | null, (value: UUID | null) => void]> | undefined>(undefined)
export default SubmissionContext
