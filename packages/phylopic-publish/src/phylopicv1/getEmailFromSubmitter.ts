import slugify from "slugify"
import { Image } from "./models/Image"
const getEmailFromSubmitter = (image: Image) => {
    if (image.submitter.email) {
        return image.submitter.email
    }
    if (image.submitter.firstName || image.submitter.lastName) {
        return (
            [image.submitter.firstName ?? "", image.submitter.lastName ?? ""]
                .filter(Boolean)
                .map(name => slugify(name))
                .filter(Boolean)
                .join(".")
                .replace(/\.+/g, ".") + "@contribute.phylopic.org"
        )
    }
    console.warn("No email or name!", image.submitter)
    return image.submitter.uid + "@contribute.phylopic.org"
}
export default getEmailFromSubmitter
