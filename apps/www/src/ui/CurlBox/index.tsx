import { Loader, LoaderContext } from "@phylopic/ui"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { FC, ReactNode, Suspense, useState } from "react"
import type { ReactJsonViewProps, ThemeObject } from "react-json-view"
import useSWR from "swr"
import customEvents from "~/analytics/customEvents"
import { CurlOptions } from "./CurlOptions"
import styles from "./index.module.scss"
import useCommandKey from "./useCommandKey"
import useCommandLine from "./useCommandLine"
const ReactJsonView = dynamic(() => import("react-json-view"), { ssr: false })

export interface Props {
    options?: CurlOptions
    title: ReactNode
    url: string
}
const fetcher = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
        return await axios(config)
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            return e.response
        }
        throw e
    }
}
const shouldCollapse: ReactJsonViewProps["shouldCollapse"] = ({ src, name, type }) =>
    name === "_links" || name === "_embedded" || (type === "array" && (src as unknown[])?.length > 1)
const THEME: ThemeObject = {
    base00: "#305860", // background
    base01: "#000",
    base02: "#16aba6", // vertical lines
    base03: "#000",
    base04: "#000",
    base05: "#000",
    base06: "#000",
    base07: "#fff", // base text
    base08: "#000",
    base09: "#f5bb00", // strings, ellipses
    base0A: "#000", // null
    base0B: "#fade85", // floats
    base0C: "#fade85", // array indices
    base0D: "#16aba6", // down carets
    base0E: "#16aba6", // right carets
    base0F: "#fade85", // integers, copy buttons
}
const CurlBox: FC<Props> = ({ options, title, url }) => {
    const [requested, setRequested] = useState(false)
    const line = useCommandLine(url, options)
    const key = useCommandKey(url, options)
    const { data, error, isLoading } = useSWR(requested ? key : null, fetcher)
    return (
        <section>
            <header className={styles.header}>{title}</header>
            <div className={clsx(styles.sample, requested && styles.requested)}>
                <code>{line}</code>
                {!isLoading && !(data || error) && (
                    <button
                        className={styles.controlButton}
                        onClick={() => {
                            customEvents.makeApiCall(title)
                            setRequested(true)
                        }}
                        title="Make API Call"
                    >
                        ⏵
                    </button>
                )}
                {!isLoading && (data || error) && (
                    <button
                        className={styles.controlButton}
                        onClick={() => {
                            customEvents.clearApiResults(title)

                            setRequested(false)
                        }}
                        title="Clear"
                    >
                        ✖
                    </button>
                )}
                <button
                    className={styles.controlButton}
                    onClick={() => {
                        customEvents.copyApiCommand(title)
                        navigator.clipboard.writeText(line)
                    }}
                    title="Copy to Clipboard"
                >
                    ⎘
                </button>
            </div>
            {requested && (
                <>
                    {!data && !error ? (
                        <div className={styles.loaderContainer}>
                            <LoaderContext.Provider value={{ color: "#f7fffb" }}>
                                <Loader />
                            </LoaderContext.Provider>
                        </div>
                    ) : error ? (
                        <p className={styles.error}>
                            <code>{String(error)}</code>
                        </p>
                    ) : !data ? (
                        <p className={styles.empty}>No response.</p>
                    ) : (
                        <div>
                            <p
                                className={clsx(
                                    styles.status,
                                    data.status >= 400 ? styles.statusError : styles.statusSuccess,
                                )}
                            >
                                <code>
                                    {data.status} {data.statusText}
                                </code>
                            </p>
                            <Suspense fallback={<Loader />}>
                                <ReactJsonView
                                    displayDataTypes={false}
                                    displayObjectSize={false}
                                    name={null}
                                    shouldCollapse={shouldCollapse}
                                    src={data.data}
                                    style={{
                                        borderBottomLeftRadius: "1em",
                                        borderBottomRightRadius: "1em",
                                        fontSize: "larger",
                                        letterSpacing: 0,
                                        padding: "1em",
                                    }}
                                    theme={THEME}
                                />
                            </Suspense>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
export default CurlBox
