import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function run(command, args, label) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd: root, stdio: "inherit" })
        child.on("error", reject)
        child.on("close", (code) => {
            if (code === 0) {
                resolve()
                return
            }
            reject(new Error(`${label} failed with exit code ${code}`))
        })
    })
}

const apiDeploy = run("sls", ["deploy"], "sls deploy")
    .then(() => run("node", ["./scripts/invalidate-cloudfront-cache.mjs"], "CloudFront invalidation"))
    .then(() => run("rm", ["-rf", ".serverless"], "cleanup"))

const docsDeploy = run(
    "aws",
    ["s3", "sync", "--acl", "public-read", "--delete", "./docs/dist", "s3://api-docs.phylopic.org"],
    "docs deploy",
)

try {
    await Promise.all([apiDeploy, docsDeploy])
} catch (error) {
    console.error(error.message)
    process.exit(1)
}
