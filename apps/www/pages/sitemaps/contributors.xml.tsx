import { NextPage } from "next"
import createGetServerSideListSitemapProps from "~/ssr/createGetServerSideListSitemapProps"
const PageComponent: NextPage = () => null
export const getServerSideProps = createGetServerSideListSitemapProps("/contributors")
export default PageComponent
