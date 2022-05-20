import { useContext, FC } from "react"
import LicenseFilterTypeContext from "./LicenseFilterTypeContext"
const LicenseQualifier: FC = () => {
    const [licenses] = useContext(LicenseFilterTypeContext) ?? []
    switch (licenses) {
        case "-nc": {
            return <> that is free for commercial usage</>
        }
        case "-nc-sa": {
            return <> that is free for commercial usage and has no ShareAlike requirement</>
        }
        case "-sa": {
            return <> that has no ShareAlike requirement</>
        }
        case "publicdomain": {
            return <> in the public domain</>
        }
        default: {
            return null
        }
    }
}
export default LicenseQualifier
