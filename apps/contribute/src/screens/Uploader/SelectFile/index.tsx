import clsx from "clsx"
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useMemo } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import useBuffer from "../hooks/useBuffer"
import useFileIsVector from "../hooks/useFileIsVector"
import useFileState from "../hooks/useFileState"
import useFileTooBig from "../hooks/useFileTooBig"
import useImageSize from "../hooks/useImageSize"
import useImageSource from "../hooks/useImageSource"
import useImageTooSmall from "../hooks/useImageTooSmall"
import useWindowDragHighlight from "../hooks/useWindowDragHighlight"
import MEBIBYTE from "../MEBIBYTE"
import Pending from "../Pending"
import { FileResult } from "./FileResult"
import styles from "./index.module.scss"
const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
}
const MAX_FILE_SIZE_MEBIBYTES = 1
const MAX_FILE_SIZE = MAX_FILE_SIZE_MEBIBYTES * MEBIBYTE
const MIN_LENGTH_PIXELS = 512
const MIN_AREA_PIXELS_SQUARED = 128 * MIN_LENGTH_PIXELS
export interface Props {
    onComplete?: (result: FileResult) => void
}
const SelectFile: FC<Props> = ({ onComplete }) => {
    const [file, setFile] = useFileState()
    const highlightDrag = useWindowDragHighlight(file === undefined)
    const handleFileInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setFile(Array.from(event.target.files ?? [])[0] ?? undefined)
        },
        [setFile],
    )
    const isVector = useFileIsVector(file)
    const tooBig = useFileTooBig(file, MAX_FILE_SIZE)
    const mebibytes = useMemo(() => (file ? (file.size / MEBIBYTE).toPrecision(2) : "0"), [file])
    const buffer = useBuffer(file, !tooBig)
    const source = useImageSource(buffer.data, file?.type)
    const size = useImageSize(source)
    const sizeText = useMemo(() => (size.data ? [...size.data].join(" × ") : undefined), [size.data])
    const tooSmall = useImageTooSmall(size.data, MIN_LENGTH_PIXELS, MIN_AREA_PIXELS_SQUARED, !isVector)
    const hasBlockingError = useMemo(
        () => tooBig || tooSmall || Boolean(buffer.error),
        [buffer.error, tooBig, tooSmall],
    )
    const handleResetClick = useCallback(() => {
        setFile(undefined)
    }, [setFile])
    useEffect(() => {
        if (file && buffer.data && source && size.data) {
            onComplete?.({ buffer: buffer.data, file, size: size.data, source })
        }
    }, [buffer.data, file, onComplete, size.data, source])
    if (buffer.pending) {
        return <Pending />
    }
    return (
        <DialogueScreen>
            <section className={clsx(styles.selectFile, highlightDrag && styles.highlighted)}>
                {!hasBlockingError && (
                    <>
                        <p>Drag and drop a silhouette image file here to get started.</p>
                        <p>
                            (
                            <a href="https://www.w3.org/TR/SVG/" target="_blank" rel="noopener noreferrer">
                                <abbr title="Scalable Vector Graphics">SVG</abbr>
                            </a>{" "}
                            is best, but{" "}
                            <a
                                href="http://www.libpng.org/pub/png/spec/1.2/PNG-Contents.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <abbr title="Portable Network Graphics">PNG</abbr>
                            </a>
                            ,{" "}
                            <a
                                href="https://www.w3.org/Graphics/GIF/spec-gif89a.txt"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <abbr title="Graphics Interchange Format">GIF</abbr>
                            </a>
                            , and{" "}
                            <a
                                href="https://www.loc.gov/preservation/digital/formats/fdd/fdd000189.shtml"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <abbr title="Bitmap Image File">BMP</abbr>
                            </a>{" "}
                            are also good. Or{" "}
                            <a href="https://www.w3.org/Graphics/JPEG/" target="_blank" rel="noopener noreferrer">
                                <abbr title="Joint Photographic Experts Group">JPEG</abbr>
                            </a>
                            , I guess.)
                        </p>
                        <p>Or, click here to browse your file system:</p>
                    </>
                )}
                {hasBlockingError && (
                    <p>
                        <strong>Whoa!</strong>
                    </p>
                )}
                {tooBig && (
                    <>
                        <p>
                            That&apos;s a big file. That&apos;s, like, {mebibytes}{" "}
                            <a
                                href="https://physics.nist.gov/cuu/Units/binary.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                mebibytes
                            </a>
                            !
                        </p>
                        <p>
                            Can you get it under {MAX_FILE_SIZE_MEBIBYTES.toLocaleString("en-us")}{" "}
                            <abbr title="mebibytes">MiB</abbr> ({MAX_FILE_SIZE.toLocaleString("en-us")} bytes)?
                        </p>
                    </>
                )}
                {tooSmall && (
                    <>
                        <p>That image is a bit small.{sizeText && ` Only ${sizeText} pixels, by my calculations.`}</p>
                        <p>
                            Can you make it at least {MIN_LENGTH_PIXELS.toLocaleString("en-us")} pixels vertically or
                            horizontally and at least {MIN_AREA_PIXELS_SQUARED.toLocaleString("en-us")} square pixels in
                            area?
                        </p>
                    </>
                )}
                {buffer.error && (
                    <>
                        <p>
                            <strong>Whoops!</strong> I had trouble processing that file. Can you check it? Here are some
                            details:
                        </p>
                        <p>&ldquo;{String(buffer.error)}&rdquo;</p>
                        <p>Any of that make sense to you?</p>
                    </>
                )}
                {hasBlockingError && (
                    <button className="cta" onClick={handleResetClick}>
                        Start over.
                    </button>
                )}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.uploadLabel}>
                        Select a File
                        <input
                            accept=".bmp,,gif,.png,.svg,.jpeg,.jpg,image/bmp,image/gif,image/png,image/svg+xml,image/jpeg"
                            type="file"
                            name="file"
                            onChange={handleFileInputChange}
                        />
                    </label>
                </form>
            </section>
        </DialogueScreen>
    )
}
export default SelectFile
