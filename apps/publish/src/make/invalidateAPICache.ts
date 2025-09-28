import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
const invalidateAPICache = async (build: number) => {
    const client = new CloudFrontClient()
    try {
        if (!process.env.API_CLOUDFRONT_DISTRIBUTION_ID) {
            throw new Error("API_CLOUDFRONT_DISTRIBUTION_ID is not set.")
        }
        await client.send(
            new CreateInvalidationCommand({
                DistributionId: process.env.API_CLOUDFRONT_DISTRIBUTION_ID,
                InvalidationBatch: {
                    CallerReference: `build:${build}`,
                    Paths: {
                        Items: ["/*"],
                        Quantity: 1,
                    },
                },
            }),
        )
    } catch (e) {
        console.error(e)
    } finally {
        client.destroy()
    }
}
export default invalidateAPICache
