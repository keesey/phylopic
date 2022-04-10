import { LicenseComponent } from "./LicenseComponent"
import LICENSE_COMPONENTS from "./LICENSE_COMPONENTS"
export const isLicenseComponent = (x: unknown): x is LicenseComponent => LICENSE_COMPONENTS.has(x as LicenseComponent)
export default isLicenseComponent
