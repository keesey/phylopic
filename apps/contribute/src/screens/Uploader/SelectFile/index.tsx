import { NumberView } from "@phylopic/ui"
import { Hash } from "@phylopic/utils"
import clsx from "clsx"
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useMemo } from "react"
import MAX_FILE_SIZE from "~/filesizes/MAX_FILE_SIZE"
import MAX_FILE_SIZE_MEBIBYTES from "~/filesizes/MAX_FILE_SIZE_MEBIBYTES"
import MIN_AREA_PIXELS_SQUARED from "~/filesizes/MIN_AREA_PIXELS_SQUARED"
import MIN_LENGTH_PIXELS from "~/filesizes/MIN_LENGTH_PIXELS"
import LoadingState from "~/screens/LoadingState"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_CIRCLE, ICON_ARROW_UP, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import MEBIBYTE from "../../../filesizes/MEBIBYTE"
import useBuffer from "../hooks/useBuffer"
import useFileIsVector from "../hooks/useFileIsVector"
import useFileState from "../hooks/useFileState"
import useFileTooBig from "../hooks/useFileTooBig"
import useImageSize from "../hooks/useImageSize"
import useImageSource from "../hooks/useImageSource"
import useImageTooSmall from "../hooks/useImageTooSmall"
import useWindowDragHighlight from "../hooks/useWindowDragHighlight"
import useWindowDrop from "../hooks/useWindowDrop"
import { FileResult } from "./FileResult"
import styles from "./index.module.scss"
const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
}
export interface Props {
    onCancel: () => void
    onComplete: (result?: FileResult) => void
    value?: Hash
}
const SelectFile: FC<Props> = ({ onCancel, onComplete, value }) => {
    const [file, setFile] = useFileState()
    const highlightDrag = useWindowDragHighlight(true)
    useWindowDrop(setFile)
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
            onComplete({ buffer: buffer.data, file, size: size.data, source })
        }
    }, [buffer.data, file, onComplete, size.data, source])
    if (buffer.pending) {
        return <LoadingState>Give me a moment to process that&hellip;</LoadingState>
    }
    return (
        <section className={clsx(styles.selectFile, highlightDrag && styles.highlighted)}>
            <Dialogue>
                <Speech mode="system">
                    <p>
                        Drag and drop a silhouette image file here to{" "}
                        {value ? "replace the one you uploaded earlier" : "get started"}.
                    </p>
                    <p>
                        <small>
                            (
                            <a href="https://www.w3.org/TR/SVG/" target="_blank" rel="noreferrer">
                                <abbr title="Scalable Vector Graphics">SVG</abbr>
                            </a>{" "}
                            is best, but{" "}
                            <a
                                href="http://www.libpng.org/pub/png/spec/1.2/PNG-Contents.html"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <abbr title="Portable Network Graphics">PNG</abbr>
                            </a>
                            ,{" "}
                            <a href="https://www.w3.org/Graphics/GIF/spec-gif89a.txt" target="_blank" rel="noreferrer">
                                <abbr title="Graphics Interchange Format">GIF</abbr>
                            </a>
                            , and{" "}
                            <a
                                href="https://www.loc.gov/preservation/digital/formats/fdd/fdd000189.shtml"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <abbr title="Bitmap Image File">BMP</abbr>
                            </a>{" "}
                            are also good. Or{" "}
                            <a href="https://www.w3.org/Graphics/JPEG/" target="_blank" rel="noreferrer">
                                <abbr title="Joint Photographic Experts Group">JPEG</abbr>
                            </a>
                            , I guess.)
                        </small>
                    </p>
                </Speech>
                <Speech mode="system">
                    <p>Or, browse your file system.</p>
                </Speech>
                <UserOptions>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.uploadLabel}>
                            <SpeechStack>
                                {ICON_ARROW_UP}
                                <span>Select a file.</span>
                            </SpeechStack>
                            <input
                                accept=".bmp,,gif,.png,.svg,.jpeg,.jpg,image/bmp,image/gif,image/png,image/svg+xml,image/jpeg"
                                type="file"
                                name="file"
                                onChange={handleFileInputChange}
                            />
                        </label>
                    </form>
                    <UserButton danger icon={ICON_X} onClick={onCancel}>
                        Never mind.
                    </UserButton>
                </UserOptions>
                {hasBlockingError && (
                    <>
                        <Speech mode="system">
                            <p>
                                <strong>{buffer.error ? "Whoops!" : "Whoa!"}</strong>
                            </p>
                            {tooBig && (
                                <>
                                    <p>
                                        That&rsquo;s a big file. That&rsquo;s, like,{" "}
                                        {mebibytes === "1.00" ? "a whole" : mebibytes}{" "}
                                        <a
                                            href="https://physics.nist.gov/cuu/Units/binary.html"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            mebibyte{mebibytes === "1.00" ? "" : "s"}
                                        </a>
                                        !
                                    </p>
                                    <p>
                                        Can you get it under <NumberView value={MAX_FILE_SIZE_MEBIBYTES} />{" "}
                                        <abbr title="mebibytes">MiB</abbr>{" "}
                                        <small>
                                            (<NumberView value={MAX_FILE_SIZE} /> bytes)
                                        </small>
                                        ?
                                    </p>
                                </>
                            )}
                            {tooSmall && (
                                <>
                                    <p>
                                        That image is a bit small.
                                        {sizeText && ` Only ${sizeText} pixels, by my calculations.`}
                                    </p>
                                    <p>
                                        Can you make it at least <NumberView value={MIN_LENGTH_PIXELS} /> pixels
                                        vertically or horizontally <strong>and</strong> at least{" "}
                                        <NumberView value={MIN_AREA_PIXELS_SQUARED} /> square pixels in area?
                                    </p>
                                </>
                            )}
                            {Boolean(buffer.error) && (
                                <>
                                    <p>
                                        Had some trouble processing that file. Can you check it? Here are some details:
                                    </p>
                                    <p>&ldquo;{String(buffer.error)}&rdquo;</p>
                                    <p>Any of that make sense to you?</p>
                                </>
                            )}{" "}
                        </Speech>
                        <UserOptions>
                            <UserButton danger icon={ICON_ARROW_CIRCLE} onClick={handleResetClick}>
                                Start over.
                            </UserButton>
                        </UserOptions>
                    </>
                )}
            </Dialogue>
        </section>
    )
}
export default SelectFile
