import { Listable, Page } from "../interfaces"
export const iterateList = <TValue, TPageSpecifier>(list: Listable<TValue, TPageSpecifier>): AsyncIterable<TValue> => {
    let page: Page<TValue, TPageSpecifier> | undefined
    let currentIndex = -1
    return {
        [Symbol.asyncIterator]() {
            return {
                next: async () => {
                    if (!page) {
                        page = await list.page()
                    }
                    if (++currentIndex >= page.items.length) {
                        if (!page.next) {
                            return {
                                done: true,
                                value: page.items[currentIndex],
                            }
                        } else {
                            page = await list.page(page.next)
                            if (!page.items.length) {
                                return {
                                    done: true,
                                    value: page.items[currentIndex],
                                }
                            }
                            currentIndex = 0
                        }
                    }
                    return {
                        value: page.items[currentIndex],
                    }
                },
            }
        },
    }
}
export default iterateList
