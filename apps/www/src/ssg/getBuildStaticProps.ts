import type { GetStaticProps } from "next"
import BUILD from "~/build/parseBuildFromEnv"
export type Props = {
    build: number
}
const getBuildStaticProps: GetStaticProps<Props, Record<string, never>> = async () => ({
    props: { build: BUILD },
})
export default getBuildStaticProps
