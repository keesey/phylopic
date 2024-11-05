import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
const invalidateAPICache = async () => {
    const client = new CloudFrontClient()
    try {
        if (!process.env.API_CLOUDFRONT_DISTRIBUTION_ID) {
            throw new Error("API_CLOUDFRONT_DISTRIBUTION_ID is not set.")
        }
        await client.send(
            new CreateInvalidationCommand({
                DistributionId: process.env.API_CLOUDFRONT_DISTRIBUTION_ID,
                InvalidationBatch: {
                    CallerReference: undefined,
                    Paths: {
                        Items: ["/*"],
                        Quantity: undefined,
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
