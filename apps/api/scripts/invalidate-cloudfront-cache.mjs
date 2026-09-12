import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
import { config } from "dotenv"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") })

const distributionId = process.env.API_CLOUDFRONT_DISTRIBUTION_ID
if (!distributionId) {
    console.error(
        "API_CLOUDFRONT_DISTRIBUTION_ID is not set. CloudFront was not invalidated; api.phylopic.org may serve stale responses.",
    )
    console.error("Set it in apps/api/.env (same value as apps/publish/.env) and run: yarn invalidate-cache")
    process.exit(1)
}

const pkg = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8"))
const client = new CloudFrontClient()
try {
    const result = await client.send(
        new CreateInvalidationCommand({
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: `api:${pkg.version}:${Date.now()}`,
                Paths: {
                    Items: ["/*"],
                    Quantity: 1,
                },
            },
        }),
    )
    console.info(`CloudFront invalidation created: ${result.Invalidation?.Id ?? "(unknown id)"}`)
} catch (e) {
    console.error(e)
    process.exit(1)
} finally {
    client.destroy()
}
