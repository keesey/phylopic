import type { APIGatewayProxyResult } from "aws-lambda"

const getRobots = (): APIGatewayProxyResult => ({
    body: "User-agent: *\nDisallow: /\n",
    headers: {
        "cache-control": `public, max-age=${24 * 60 * 60}`,
        "content-type": "text/plain; charset=utf-8",
    },
    statusCode: 200,
})

export default getRobots
