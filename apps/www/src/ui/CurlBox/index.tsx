import { Loader, LoaderContext } from "@phylopic/ui"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { FC, Suspense, useState } from "react"
import type { ReactJsonViewProps, ThemeObject } from "react-json-view"
import useSWR from "swr"
import { CurlOptions } from "./CurlOptions"
import styles from "./index.module.scss"
import useCommandKey from "./useCommandKey"
import useCommandLine from "./useCommandLine"
const ReactJsonView = dynamic(() => import("react-json-view"), { ssr: false })

export interface Props {
    options?: CurlOptions
    url: string
}
const fetcher = (config: AxiosRequestConfig): Promise<AxiosResponse> => axios(config)
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
    base0B: "#000",
    base0C: "#fade85", // array indices
    base0D: "#16aba6", // down carets
    base0E: "#16aba6", // right carets
    base0F: "#fade85", // numbers, booleans, copy buttons
}
const CurlBox: FC<Props> = ({ options, url }) => {
    const [requested, setRequested] = useState(false)
    const line = useCommandLine(url, options)
    const key = useCommandKey(url, options)
    const { data, error, isLoading } = useSWR(requested ? key : null, fetcher)
    return (
        <section className={styles.main}>
            <div className={clsx(styles.sample, requested && styles.requested)}>
                <code>{line}</code>
                {!isLoading && !(data || error) && (
                    <button className={styles.controlButton} onClick={() => setRequested(true)} title="Make API Call">
                        ⏵
                    </button>
                )}
                {!isLoading && (data || error) && (
                    <button className={styles.controlButton} onClick={() => setRequested(false)} title="Clear">
                        ✖
                    </button>
                )}
                <button
                    className={styles.controlButton}
                    onClick={() => navigator.clipboard.writeText(line)}
                    title="Copy to Clipboard"
                >
                    ⎘
                </button>
            </div>
            {requested && (
                <div className={styles.response}>
                    {isLoading ? (
                        <LoaderContext.Provider value={{ color: "" }}>
                            <Loader />
                        </LoaderContext.Provider>
                    ) : error ? (
                        <p className={styles.error}>
                            <code>{String(error)}</code>
                        </p>
                    ) : !data ? (
                        <p className={styles.empty}>No response.</p>
                    ) : data.status >= 400 ? (
                        <p className={styles.error}>
                            <code>
                                {data.status}: {data.statusText}
                            </code>
                        </p>
                    ) : (
                        <div>
                            <p className={styles.status}>
                                <code>
                                    {data.status}: {data.statusText}
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
                                        padding: "1em",
                                    }}
                                    theme={THEME}
                                />
                            </Suspense>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}
export default CurlBox
