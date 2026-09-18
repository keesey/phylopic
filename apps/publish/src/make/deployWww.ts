import { spawn } from "child_process"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const VERCEL_ENVIRONMENTS = "production,preview,development"

const DEFAULT_VERCEL_PROJECT = "phylopic-www"

const getWwwRoot = () => join(dirname(fileURLToPath(import.meta.url)), "../../..", "www")

const getVercelProject = () => process.env.VERCEL_PROJECT_ID ?? DEFAULT_VERCEL_PROJECT

const sanitizeArg = (arg: string) => (arg.startsWith("--token=") ? "--token=<redacted>" : arg)

const buildVercelArgs = (args: readonly string[]) => {
    const token = process.env.VERCEL_TOKEN
    if (!token) {
        throw new Error("VERCEL_TOKEN is required to deploy www.")
    }
    const scope = process.env.VERCEL_SCOPE
    return [
        ...args,
        "--project",
        getVercelProject(),
        ...(scope ? (["--scope", scope] as const) : []),
        `--token=${token}`,
    ]
}

const runVercel = async (args: readonly string[], stdin?: string, captureStdout = false) => {
    const cwd = getWwwRoot()
    const fullArgs = buildVercelArgs(args)
    return await new Promise<string | void>((resolve, reject) => {
        const child = spawn("vercel", fullArgs, {
            cwd,
            env: process.env,
            stdio: [stdin !== undefined ? "pipe" : "inherit", captureStdout ? "pipe" : "inherit", "inherit"],
        })
        if (stdin && child.stdin) {
            child.stdin.write(stdin)
            child.stdin.end()
        }
        let stdout = ""
        if (captureStdout && child.stdout) {
            child.stdout.on("data", (chunk: Buffer | string) => {
                stdout += chunk.toString()
            })
        }
        child.on("error", reject)
        child.on("close", code => {
            if (code === 0) {
                resolve(captureStdout ? stdout : undefined)
            } else {
                reject(
                    new Error(
                        `vercel ${args.map(sanitizeArg).join(" ")} exited with code ${code}. Check release-error.log for CLI output.`,
                    ),
                )
            }
        })
    })
}

type VercelDeploymentListItem = {
    readonly uid?: string
}

type VercelDeploymentListResponse = {
    readonly deployments?: readonly VercelDeploymentListItem[]
}

const getLatestProductionDeploymentId = async (): Promise<string> => {
    const output = await runVercel(
        ["list", getVercelProject(), "--environment", "production", "--json", "--yes", "--limit", "1"],
        undefined,
        true,
    )
    if (typeof output !== "string" || !output.trim()) {
        throw new Error("Could not list Vercel production deployments.")
    }
    const parsed = JSON.parse(output) as VercelDeploymentListItem[] | VercelDeploymentListResponse
    const deployments = Array.isArray(parsed) ? parsed : parsed.deployments
    const deploymentId = deployments?.[0]?.uid
    if (!deploymentId) {
        throw new Error("No production deployment found to redeploy.")
    }
    return deploymentId
}

const deployWww = async (build: number) => {
    const buildValue = build.toString(10)
    console.info(`Setting Vercel env NEXT_PUBLIC_BUILD =`, buildValue, `(${VERCEL_ENVIRONMENTS})...`)
    await runVercel(["env", "add", "NEXT_PUBLIC_BUILD", VERCEL_ENVIRONMENTS, "--force", "--yes"], buildValue)
    const deploymentId = await getLatestProductionDeploymentId()
    console.info("Redeploying www production from", deploymentId, "...")
    await runVercel(["redeploy", deploymentId, "--yes"])
    console.info("www production redeploy finished.")
}

export default deployWww
