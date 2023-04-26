import { FC } from "react"
import customEvents from "~/analytics/customEvents"
import styles from "./index.module.scss"

const MailingListForm: FC = () => {
    return (
        <form
            action="https://phylopic.us17.list-manage.com/subscribe/post?u=e566f9716747a52421a7b5ac7&amp;id=f5b825e47d"
            method="post"
            onSubmit={() => customEvents.submitForm("mailing_list")}
            target="_blank"
        >
            <div className={styles.offscreen} aria-hidden="true">
                <input type="text" name="b_e566f9716747a52421a7b5ac7_f5b825e47d" tabIndex={-1} />
            </div>
            <div className={styles.content}>
                <input type="email" name="EMAIL" placeholder="Enter your email address" />
                <button type="submit">Subscribe</button>
            </div>
        </form>
    )
}
export default MailingListForm
