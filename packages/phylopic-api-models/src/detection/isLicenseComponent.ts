import { LicenseComponent } from "../types/LicenseComponent"
import LICENSE_COMPONENTS from "../constants/LICENSE_COMPONENTS"
export const isLicenseComponent = (x: unknown): x is LicenseComponent => LICENSE_COMPONENTS.has(x as LicenseComponent)
export default isLicenseComponent
