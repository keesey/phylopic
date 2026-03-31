const MAX_TIMEOUT = 2147483647
class ChunkedTimeout {
    private handle: NodeJS.Timeout | undefined
    constructor(private callback?: () => void, private msLeft: number = 0) {
        this.next()
    }
    public clear() {
        this.msLeft = 0
        delete this.callback
        if (this.handle) {
            clearTimeout(this.handle)
            delete this.handle
        }
    }
    private next() {
        if (!(this.msLeft > 0)) {
            const callback = this.callback
            this.clear()
            callback?.()
        } else {
            const ms = Math.min(MAX_TIMEOUT, this.msLeft)
            this.msLeft -= ms
            this.handle = setTimeout(() => this.next(), ms)
        }
    }
}
export const setChunkedTimeout = (callback: () => void, ms: number) => {
    if (ms <= 0) {
        callback()
    } else if (isFinite(ms)) {
        if (ms <= MAX_TIMEOUT) {
            const handle = setTimeout(callback, ms)
            return () => clearTimeout(handle)
        }
        {
            const timeout = new ChunkedTimeout(callback, ms)
            return () => timeout.clear()
        }
    }
}
