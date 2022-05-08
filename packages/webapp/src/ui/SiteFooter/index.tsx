/* eslint-disable @next/next/no-img-element */
import clsx from "clsx"
import { FC } from "react"
import styles from "./index.module.scss"
const YEAR = new Date().getFullYear()
const SiteFooter: FC = () => (
    <footer className={styles.main}>
        <ul>
            <li className={styles.item}>
                <abbr title="Copyright">©</abbr> {YEAR} <a href="http://tmkeesey.net">T. Michael Keesey</a>
            </li>
            <li className={clsx(styles.item, styles.logos)}>
                <a href="https://www.twitter.com/phylopic" title="Follow @phylopic on Twitter.">
                    <img src="/logos/twitter.svg" width={28} height={28} alt="Twitter" />
                </a>
                <a href="https://www.facebook.com/phylopic" title="Follow @phylopic on Facebook.">
                    <img src="/logos/facebook.svg" width={21} height={21} alt="Facebook" />
                </a>
                <a href="https://www.patreon.com/tmkeesey" title="Support the creator of PhyloPic on Patreon.">
                    <img src="/logos/patreon-white.svg" width={80} height={11.12} alt="Patreon" />
                </a>
            </li>
        </ul>
    </footer>
)
export default SiteFooter