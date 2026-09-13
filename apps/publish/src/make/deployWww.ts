import { spawn } from "child_process"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const VERCEL_ENVIRONMENTS = ["production", "preview", "development"] as const

const getWwwRoot = () => join(dirname(fileURLToPath(import.meta.url)), "../../..", "www")

const runVercel = async (args: readonly string[], stdin?: string) => {
    const token = process.env.VERCEL_TOKEN
    if (!token) {
        throw new Error("VERCEL_TOKEN is required to deploy www.")
    }
    const cwd = getWwwRoot()
    const fullArgs = [...args, `--token=${token}`]
    const projectId = process.env.VERCEL_PROJECT_ID
    if (projectId) {
        fullArgs.push("--project", projectId)
    }
    const scope = process.env.VERCEL_SCOPE
    if (scope) {
        fullArgs.push("--scope", scope)
    }
    await new Promise<void>((resolve, reject) => {
        const child = spawn("vercel", fullArgs, {
            cwd,
            env: process.env,
            stdio: [stdin !== undefined ? "pipe" : "inherit", "inherit", "inherit"],
        })
        if (stdin && child.stdin) {
            child.stdin.write(stdin)
            child.stdin.end()
        }
        child.on("error", reject)
        child.on("close", code => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`vercel ${fullArgs.join(" ")} exited with code ${code}.`))
            }
        })
    })
}

const deployWww = async (build: number) => {
    const buildValue = build.toString(10)
    for (const environment of VERCEL_ENVIRONMENTS) {
        console.info(`Setting Vercel ${environment} env NEXT_PUBLIC_BUILD =`, buildValue, "...")
        await runVercel(["env", "add", "NEXT_PUBLIC_BUILD", environment, "--force", "--yes"], buildValue)
    }
    console.info("Deploying www to production...")
    await runVercel(["deploy", "--prod", "--yes"])
    console.info("www production deploy finished.")
}

export default deployWww
