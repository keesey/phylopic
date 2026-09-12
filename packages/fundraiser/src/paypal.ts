const PAYPAL_IPN_VERIFY_URL =
    process.env.PAYPAL_IPN_SANDBOX === "true"
        ? "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr"
        : "https://ipnpb.paypal.com/cgi-bin/webscr"

export type PayPalIpnFields = Readonly<Record<string, string>>

export const normalizeIpnBody = (body: unknown): PayPalIpnFields => {
    if (typeof body !== "object" || body === null) {
        return {}
    }
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
            fields[key] = value
        }
    }
    return fields
}

export const verifyPayPalIpn = async (fields: PayPalIpnFields): Promise<boolean> => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(fields)) {
        params.append(key, value)
    }
    params.append("cmd", "_notify-validate")
    const response = await fetch(PAYPAL_IPN_VERIFY_URL, {
        body: params.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
    })
    const text = (await response.text()).trim()
    return text === "VERIFIED"
}

export const isCompletedDonation = (fields: PayPalIpnFields): boolean =>
    fields.payment_status === "Completed" && fields.mc_currency === "USD"
