const postcss = require("postcss")
const cssnanoSimple = require("next/dist/compiled/cssnano-simple")
const postcssScss = require("next/dist/compiled/postcss-scss")
const { webpack, sources } = require("next/dist/compiled/webpack/webpack")
const { getCompilationSpan } = require("next/dist/build/webpack/utils")

const CSS_REGEX = /\.css(\?.*)?$/i

class CssMinimizerPlugin {
    constructor(options) {
        this.__next_css_remove = true
        this.options = options
    }

    optimizeAsset(file, asset) {
        const postcssOptions = {
            ...this.options.postcssOptions,
            to: file,
            from: file,
            parser: postcssScss,
        }
        const input = asset.source()
        return postcss([
            cssnanoSimple(
                {
                    colormin: false,
                    mergeRules: false,
                },
                postcss,
            ),
        ])
            .process(input, postcssOptions)
            .then(res => {
                // Next.js concatenates CSS modules with a UTF-8 BOM before each module's
                // first rule, which breaks selector matching in production (see v2.14.16).
                const css = res.css.replace(/\ufeff/g, "")
                if (res.map) {
                    return new sources.SourceMapSource(css, file, res.map.toJSON())
                }
                return new sources.RawSource(css)
            })
    }

    apply(compiler) {
        compiler.hooks.compilation.tap("CssMinimizerPlugin", compilation => {
            const cache = compilation.getCache("CssMinimizerPlugin")
            compilation.hooks.processAssets.tapPromise(
                {
                    name: "CssMinimizerPlugin",
                    stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
                },
                async assets => {
                    const compilationSpan = getCompilationSpan(compilation) || getCompilationSpan(compiler)
                    const cssMinimizerSpan = compilationSpan.traceChild("css-minimizer-plugin")
                    return cssMinimizerSpan.traceAsyncFn(async () => {
                        const files = Object.keys(assets)
                        await Promise.all(
                            files
                                .filter(file => CSS_REGEX.test(file))
                                .map(async file => {
                                    const assetSpan = cssMinimizerSpan.traceChild("minify-css")
                                    assetSpan.setAttribute("file", file)
                                    return assetSpan.traceAsyncFn(async () => {
                                        const assetSource = compilation.getAsset(file).source
                                        const etag = cache.getLazyHashedEtag(assetSource)
                                        const cachedResult = await cache.getPromise(file, etag)
                                        assetSpan.setAttribute("cache", cachedResult ? "HIT" : "MISS")
                                        if (cachedResult) {
                                            compilation.updateAsset(file, cachedResult)
                                            return
                                        }
                                        const result = await this.optimizeAsset(file, assetSource)
                                        await cache.storePromise(file, etag, result)
                                        compilation.updateAsset(file, result)
                                    })
                                }),
                        )
                    })
                },
            )
        })
    }
}

module.exports = { CssMinimizerPlugin }
