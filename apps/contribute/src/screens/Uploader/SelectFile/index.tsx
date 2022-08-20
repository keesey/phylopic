import { NumberView } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import clsx from "clsx"
import { useRouter } from "next/router"
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useMemo } from "react"
import useImageHasSourceFile from "~/editing/hooks/useImageHasSourceFile"
import useImageDeletor from "~/editing/hooks/useImageDeletor"
import LoadingState from "~/screens/LoadingState"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_UP, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
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
    uuid: UUID
}
const SelectFile: FC<Props> = ({ onComplete, uuid }) => {
    const hasExisting = useImageHasSourceFile(uuid)
    const deletor = useImageDeletor(uuid)
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
    const router = useRouter()
    const handleCancelButtonClick = useCallback(() => {
        deletor()
        router.push("/")
    }, [hasExisting, uuid])
    if (hasExisting === undefined) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    if (buffer.pending) {
        return <Pending />
    }
    return (
        <section className={clsx(styles.selectFile, highlightDrag && styles.highlighted)}>
            <Dialogue>
                <Speech mode="system">
                    <p>
                        Drag and drop a silhouette image file here to{" "}
                        {hasExisting ? "replace the one you uploaded earlier" : "get started"}.
                    </p>
                    <p>
                        <small>
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
                    <UserButton danger icon={ICON_X} onClick={handleCancelButtonClick}>
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
                                        That&rsquo;s a big file. That&rsquo;s, like, {mebibytes}{" "}
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
                            <UserButton danger onClick={handleResetClick}>
                                Reset.
                            </UserButton>
                        </UserOptions>
                    </>
                )}
            </Dialogue>
        </section>
    )
}
export default SelectFile
