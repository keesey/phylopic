import { URL } from "@phylopic/utils"
import { GetServerSideProps, NextPage } from "next"
const Page: NextPage = () => null
const URLS: readonly URL[] = [
    "https://www.phylopic.org",
    "https://www.phylopic.org/contributors",
    "https://www.phylopic.org/images",
    "https://www.phylopic.org/mailinglist",
    "https://www.phylopic.org/nodes",
    "https://www.phylopic.org/thanks",
]
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const lastmod = new Date().toISOString()
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${URLS.map(
          url => `
            <url>
              <loc>${url}</loc>
              <lastmod>${lastmod}</lastmod>
            </url>
          `,
      ).join("")}
    </urlset>
  `
    res.setHeader("Content-Type", "text/xml")
    res.write(sitemap)
    res.end()
    return {
        props: {},
    }
}
export default Page
