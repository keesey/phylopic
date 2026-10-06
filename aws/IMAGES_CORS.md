# CORS for `images.phylopic.org`

Public silhouettes on `https://images.phylopic.org` work in `<img>` and SVG `<image href="…">` without CORS. The **www collection cladogram generator** also **`fetch()`es `vector.svg`** in the browser to read each file’s SVG `viewBox` for layout. That cross-origin request needs `Access-Control-Allow-Origin` (and related headers) on the **response the browser sees**—usually from CloudFront, not only from S3.

Objects are already world-readable. CORS does not change who can download files; it lets JavaScript on other origins read the response body.

Reference for **`aws s3api put-bucket-cors`**: [`images-bucket-cors.json`](./images-bucket-cors.json) (must include top-level `"CORSRules"`, not a bare array). Console-only paste format: [`images-bucket-cors-console.json`](./images-bucket-cors-console.json).

---

## Step-by-step (CLI)

Use a profile that can change the bucket and CloudFront (e.g. account admin or a role with `s3:PutBucketCORS` and CloudFront update permissions). From the **repository root**:

### 1. Apply S3 bucket CORS

```bash
aws s3api put-bucket-cors \
  --bucket images.phylopic.org \
  --cors-configuration file://aws/images-bucket-cors.json
```

Confirm:

```bash
aws s3api get-bucket-cors --bucket images.phylopic.org
```

You should see one rule with `"AllowedOrigins": ["*"]`, `"AllowedMethods": ["GET", "HEAD"]`.

### 2. Find the CloudFront distribution for `images.phylopic.org`

```bash
aws cloudfront list-distributions --query \
  "DistributionList.Items[?Aliases.Items[?@=='images.phylopic.org']].{Id:Id,Domain:DomainName,Status:Status}" \
  --output table
```

Note the **Id** (e.g. `E1234ABCDEFGH`). If the alias is on a wildcard or only on the S3 website endpoint, open the [CloudFront console](https://console.aws.amazon.com/cloudfront/v4/home) and pick the distribution whose **Alternate domain name** is `images.phylopic.org`.

### 3. Configure CloudFront so CORS headers reach the browser

S3 adds CORS headers only when it receives the request **`Origin`** header. Cached responses without those headers will keep failing until TTL expires or you invalidate.

Pick **one** approach:

#### Option A — Forward `Origin` to S3 (matches bucket CORS)

1. Open the distribution → **Behaviors** → select the default (or behavior for `images.phylopic.org`).
2. **Edit**.
3. Under **Origin request policy**, choose a policy that forwards **`Origin`** to S3 (or create one: whitelist header `Origin`).
4. Under **Cache policy**, use a policy that **includes `Origin` in the cache key** or otherwise does not serve a non-CORS cached object to a CORS `fetch`. (Managed policy *CORS-S3Origin* is a common starting point when the origin is S3.)
5. Save and wait for deployment (**Status: Deployed**).

#### Option B — Response headers policy (simple `*` on all responses)

CloudFront adds CORS headers on every response from this behavior. You do **not** need to forward `Origin` to S3 for this option (keep bucket CORS anyway for direct S3 tests).

**B1. Create the policy (console)**

1. Open [CloudFront → Policies](https://console.aws.amazon.com/cloudfront/v4/home#/policies).
2. **Response headers** tab → **Create response headers policy**.
3. **Details**
   - **Name:** e.g. `phylopic-images-public-cors`
   - **Description:** optional (e.g. `CORS * for images.phylopic.org vector fetch`)
4. **Cross-origin resource sharing (CORS)** — expand and configure:
   - Turn **Configure CORS** on.
   - **Access control allow origins:** choose **All origins** (this sets `Access-Control-Allow-Origin: *`).  
     Do **not** enable “Origin override” unless you know you need it.
   - **Access control allow methods:** check **GET** and **HEAD** only.
   - **Access control allow headers:** **All headers** (or at minimum what browsers send on `fetch`; `*` is fine for public read-only files).
   - **Access control expose headers:** optional; leave empty or add `Content-Type`, `Content-Length`, `ETag` if you want scripts to read them.
   - **Access control max age (seconds):** e.g. `86400` (optional; helps if you add `OPTIONS` later).
   - Leave **Access control allow credentials** **off** (required when using `*` origin).
5. **Create policy**.

**B2. Attach the policy to the distribution**

1. [CloudFront → Distributions](https://console.aws.amazon.com/cloudfront/v4/home#/distributions) → open the distribution for **`images.phylopic.org`**.
2. **Behaviors** tab → select the behavior that serves your objects (usually **Default (*)** if the whole distribution is the images bucket) → **Edit**.
3. Scroll to **Cache key and origin requests** (wording may vary slightly).
4. **Response headers policy:** choose **phylopic-images-public-cors** (the policy you created).
5. **Save changes**.
6. On the distribution overview, wait until **Last modified** finishes and status is **Deployed** (often a few minutes).

**B3. Invalidate cache** — continue with step 4 below (`/images/*`).

**Option B checklist**

| Setting | Value |
|--------|--------|
| Allow origin | `*` (All origins) |
| Allow methods | `GET`, `HEAD` |
| Allow credentials | Off |
| Attached to | `images.phylopic.org` behavior |

### 4. Invalidate cached objects (recommended once)

After the distribution deploys, clear cached SVGs so the next request gets fresh headers:

```bash
DIST_ID=E1234ABCDEFGH   # from step 2

aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/images/*"
```

Narrower path is fine if you prefer (e.g. one UUID’s folder).

### 5. Smoke test

**Terminal** (must show CORS headers):

```bash
curl -sI -H "Origin: https://www.phylopic.org" \
  "https://images.phylopic.org/images/6885c062-5deb-4ebf-a481-752186819108/vector.svg" \
  | grep -i access-control
```

Expect at least:

```http
access-control-allow-origin: *
```

**Browser:** on `http://localhost:3000`, open a collection → **Generate Cladogram**. In DevTools → Network, `vector.svg` requests should succeed (no CORS error).

---

## Step-by-step (AWS Console only)

### 1. S3 bucket CORS

1. [S3 console](https://s3.console.aws.amazon.com/s3/buckets) → bucket **`images.phylopic.org`**.
2. **Permissions** tab → **Cross-origin resource sharing (CORS)** → **Edit**.
3. Paste the JSON from [`images-bucket-cors-console.json`](./images-bucket-cors-console.json) (S3 console expects a **bare array** of rules, not `CORSRules`).
4. **Save changes**.

### 2. CloudFront

1. [CloudFront console](https://console.aws.amazon.com/cloudfront/v4/home) → distribution for **`images.phylopic.org`**.
2. **Behaviors** → select the relevant behavior → **Edit**.
3. Apply **Option A** or **Option B** from CLI step 3 above.
4. **Save changes** and wait until status is **Deployed**.

### 3. Invalidation

1. Same distribution → **Invalidations** → **Create invalidation**.
2. Object paths: `/images/*` (or broader/narrower as you prefer).
3. **Create invalidation**.

### 4. Test

Same as CLI step 5 (curl and browser).

---

## Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| `get-bucket-cors` works but curl to **CloudFront URL** has no `Access-Control-*` | Origin not forwarded to S3 and no response headers policy; or old cache entry |
| Works in curl, fails in browser | Browser sent credentialed request (`credentials: 'include'`) with `Allow-Origin: *` (not allowed)—cladogram uses default `fetch` without credentials |
| Works after invalidation, breaks again later | Cache policy stores one variant without CORS; fix cache key or use response headers policy on every response |

Direct S3 URL tests (bypassing CloudFront) are useful only if your app hit S3 directly; www uses `https://images.phylopic.org`, so always verify through CloudFront.
