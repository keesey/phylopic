import { URL } from "@phylopic/utils"
import { GetServerSideProps, NextPage } from "next"
const Page: NextPage = () => null
const URLS: readonly URL[] = [
    `${process.env.NEXT_PUBLIC_WWW_URL}`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/contributors`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/images`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/nodes`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/thanks`,
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
