import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cssDir = path.join(__dirname, "../.next/static/css")

const parseRules = css => {
    const rules = new Map()
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selector = match[1].trim()
        const body = match[2].trim()
        if (!rules.has(selector)) {
            rules.set(selector, [])
        }
        rules.get(selector).push(body)
    }
    return rules
}

const hasFlexWrap = body => /\bflex-wrap\s*:\s*wrap\b/.test(body)
const hasFlexDisplay = body => /\bdisplay\s*:\s*(?:inline-)?flex\b/.test(body)

const errors = []

if (!fs.existsSync(cssDir)) {
    console.error("verify-flex-list-css: missing build output at .next/static/css (run yarn build first)")
    process.exit(1)
}

for (const file of fs.readdirSync(cssDir).filter(name => name.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(cssDir, file), "utf8")
    for (const [selector, bodies] of parseRules(css)) {
        const flexWrapWithoutDisplay = bodies.some(body => hasFlexWrap(body) && !hasFlexDisplay(body))
        const displayWithoutFlexWrap = bodies.some(body => hasFlexDisplay(body) && !hasFlexWrap(body))
        if (flexWrapWithoutDisplay && displayWithoutFlexWrap) {
            errors.push(`${file} ${selector}: flex-wrap and display:flex are split across rules`)
        }
    }
}

if (errors.length) {
    console.error("verify-flex-list-css: production CSS would break flex list wrapping:\n")
    for (const error of errors) {
        console.error(`  - ${error}`)
    }
    process.exit(1)
}

console.log("verify-flex-list-css: ok")
