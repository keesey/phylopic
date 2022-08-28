import { List, Page } from "@phylopic/api-models"
import { extractPath } from "@phylopic/utils"
import { FetchResult, fetchResult } from "@phylopic/utils-api"
import { GetServerSideProps } from "next"

const createGetServerSideListSitemapProps =
    (path: string): GetServerSideProps =>
    async ({ res }) => {
        const lastmod = new Date().toISOString()
        const listResult = await fetchResult<List>("https://" + process.env.NEXT_PUBLIC_API_DOMAIN + path)
        if (!listResult.ok) {
            throw new Error(listResult.status)
        }
        const build = listResult.data.build
        const pagePromises: Promise<FetchResult<Page>>[] = []
        for (let page = 0; page < listResult.data.totalPages; ++page) {
            pagePromises.push(
                fetchResult<Page>(
                    "https://" +
                        process.env.NEXT_PUBLIC_API_DOMAIN +
                        path +
                        `?build=${encodeURIComponent(build)}&page=${encodeURIComponent(page)}`,
                ),
            )
        }
        const pageResults = await Promise.all(pagePromises)
        const paths = pageResults.reduce<string[]>(
            (prev, result) =>
                result.ok ? [...prev, ...result.data._links.items.map(link => extractPath(link.href))] : prev,
            [],
        )
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths
          .map(
              path => `
            <url>
              <loc>https://www.phylopic.org${path}</loc>
              <lastmod>${lastmod}</lastmod>
            </url>
          `,
          )
          .join("")}
    </urlset>
  `
        res.setHeader("Content-Type", "text/xml")
        res.write(sitemap)
        res.end()
        return {
            props: {},
        }
    }
export default createGetServerSideListSitemapProps
