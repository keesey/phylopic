import { ImageFileExtension } from "./ImageFileExtension"
const isImageFileExtension = (x: unknown): x is ImageFileExtension =>
    (x as ImageFileExtension) === "bmp" ||
    (x as ImageFileExtension) === "gif" ||
    (x as ImageFileExtension) === "jpeg" ||
    (x as ImageFileExtension) === "png" ||
    (x as ImageFileExtension) === "svg"
export default isImageFileExtension
