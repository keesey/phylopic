import { join } from "path"

/** Local tree synced to `images.phylopic.org` (via `upload:images` / `sync:images`). */
export const IMAGES_PUBLISH_MIRROR = join(".s3", "images.phylopic.org", "images")

export const imagePublishMirrorPath = (...segments: string[]) => join(IMAGES_PUBLISH_MIRROR, ...segments)
