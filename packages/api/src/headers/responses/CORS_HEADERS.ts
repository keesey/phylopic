const CORS_HEADERS = {
    "access-control-allow-credentials": true,
    "access-control-allow-headers": "accept,authorization",
    "access-control-allow-methods": "GET,HEAD,OPTIONS",
    "access-control-allow-origin": "*",
    "access-control-expose-headers": "*,authorization",
    "access-control-max-age": 7200, // capped in Chromium v76+
}
export default CORS_HEADERS
