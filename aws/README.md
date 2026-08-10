# _PhyloPic_ AWS Principals

Least-privilege IAM users for the applications that authenticate to AWS with static access
keys, replacing the single `Administrator` credential that every one of them shared.

That shared credential carried `AdministratorAccess`. These policies scope each application to
what its code actually calls, so a compromised key cannot take over the whole account.

[`create-principals.sh`](./create-principals.sh) creates the four users and attaches the
policies in [`policies/`](./policies). It does not create access keys; see
[Rolling out](#rolling-out).

## The principals

| User                  | Key goes in                                           | Can do                                                 |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `phylopic-ses-sender` | `SES_*` in `apps/contribute` (Vercel + local)         | Send mail as `keesey+phylopic@gmail.com`, nothing else |
| `phylopic-contribute` | `S3_*` in `apps/contribute` (Vercel + local)          | Auth tokens, submission metadata, read source images   |
| `phylopic-www`        | `S3_*` in `apps/www` (Vercel + local)                 | Read and write `permalinks.phylopic.org/data/*`        |
| `phylopic-editorial`  | `S3_*` in `apps/edit` and `apps/publish` (local only) | Full read/write on submissions and source images       |

Splitting `SES_*` from `S3_*` makes the existing variable names honest: until now both name
pairs held the same credential, so the apparent separation of mail from storage did not exist.

`apps/api` is unaffected. It authenticates through `role/phylopic-api-executor` and holds no
key material, which is the model the rest should eventually follow.

## Where the permissions come from

Each grant below traces to code. Nothing is included speculatively — an unused permission is
the thing this exercise exists to remove.

### `auth.phylopic.org` — magic-link tokens

`Client.authToken()` reads and writes `emails/{email}/token.jwt` through `S3Editor`.
`apps/contribute/pages/api/authorize/[email]/index.ts` calls `exists()`, `get()`, and `put()`;
the `[jti]` route calls `exists()`, `get()`, and `delete()` after a successful redemption.

`S3Editor.put` is exists-then-copy-then-put, so a write touches two prefixes: it copies the
current object to `trash/emails/...` before overwriting. `S3Deletor.delete()` (used on redeem)
does the same copy-then-delete. Hence `PutObject` on both `emails/*` and `trash/emails/*`,
`DeleteObject` on `emails/*`, and `GetObject` only on `emails/*` — nothing ever reads out of
the trash, because no route calls `restore()`.

No `ListBucket`: `Client.authEmails` has no callers.

### `uploads.phylopic.org` — submissions

Objects are `files/{hash}`, with submission fields stored as S3 object **tags** rather than
body content, which is why the tagging actions are separate grants. `apps/contribute` lists a
contributor's submissions, reads and patches their metadata, and deletes them; `apps/edit` does
the same plus reading the file bytes.

`ListBucket` is needed for the listers (`S3Lister`, `S3TaggingLister`, prefix `files/`), and
`DeleteObject` plus `PutObject` on `trash/files/*` for `S3TaggingDeletor.delete()`, which is
also copy-then-delete.

Neither principal gets `PutObject` on `files/*`. Uploads arrive exclusively through the API's
`POST /uploads`, which runs as the API's Lambda role — so the ability to introduce a new
submission file is not delegated to the web apps at all.

### `source-images.phylopic.org` — accepted image sources

`apps/edit` has the full lifecycle on `images/{uuid}/source` via `ImageClient.file`, including
the cross-bucket copy performed when a submission is accepted
(`Client.ts` copies `uploads.phylopic.org/files/{hash}` to `source-images.phylopic.org/images/{uuid}/source`).
That copy needs read on the source bucket and write on the destination, both of which
`phylopic-editorial` already has.

`apps/publish` needs only `ListBucket` here, for `getSourceData.ts`. It shares the editorial
key for operational simplicity, so it currently holds more than it needs; splitting out a
list-and-read-only `phylopic-publish` user is a reasonable later refinement.

`apps/contribute` needs `GetObject` on `images/*` — not to serve bytes, but because
`getSourceImageFileURL.ts` presigns a link for the unpublished-image thumbnail. **A presigned
URL carries the signer's authority**, so the permission has to exist on the signing principal
even though the browser performs the fetch.

### SES

One call site: `apps/contribute/src/auth/smtp/sendAuthEmail.ts` sends a `SendEmail` with
`Source: keesey+phylopic@gmail.com`. The policy allows that one action against that one
identity, with a `ses:FromAddress` condition so the credential cannot send as any other
verified identity that may exist now or later.

## Two IAM details worth knowing before editing these

**`s3:HeadObject` and `s3:CopyObject` are not IAM actions.** `HeadObject` is authorized by
`s3:GetObject`, and `CopyObject` by `s3:GetObject` on the source plus `s3:PutObject` on the
destination. Policies written against the SDK's command names will silently be wrong.

**Under-granting fails quietly, not loudly.** `exists()` in `packages/source-client` treats
_any_ 4xx as "not found":

```ts
if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
    return false
}
```

So a `403` from a missing permission reads as "the object isn't there." A too-narrow policy
will not raise an error; it will make auth tokens and submissions appear not to exist. This is
why verification below is functional rather than a matter of watching for exceptions.

## Rolling out

The old credential keeps working throughout, so this can go one app at a time with no downtime.

1. **Create the users and policies:** `./create-principals.sh`.
2. **Roll out in increasing order of blast radius,** creating each user's key immediately
   before you use it:

    ```sh
    aws iam create-access-key --user-name phylopic-editorial
    ```

    The secret is displayed once and is not retrievable afterwards, so paste it straight into
    its destination and into a password manager. Order:

    1. `phylopic-editorial` → `apps/edit/.env.local`, `apps/publish/.env`. Local only, so a
       mistake costs nothing but your own time — which makes it the right place to discover a
       policy that is too narrow.
    2. `phylopic-www` → Vercel (`phylopic-www`, all targets) and `apps/www/.env.local`.
       Smallest surface: one bucket prefix.
    3. `phylopic-contribute` and `phylopic-ses-sender` → Vercel (`phylopic-contribute`, all
       targets) and `apps/contribute/.env.local`. Most moving parts, so go last.

3. **Redeploy each Vercel project after changing its variables.** Values are injected at build
   time; an existing deployment keeps the old ones until rebuilt.
4. **Verify** (below), then retire any superseded credentials from environments that no longer
   need them.

Set the Vercel variables on **every** target that project deploys — Production, Preview, and
Development are separate stores, and a stale value in one target will not propagate to the
others.

## Verification

Dry-run a policy without touching data:

```sh
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::960039257217:user/phylopic-www \
  --action-names s3:PutObject \
  --resource-arns arn:aws:s3:::permalinks.phylopic.org/data/test.json
```

Also confirm the negative cases, which are the entire point — `phylopic-www` should be
`implicitDeny` for anything in `uploads.phylopic.org`, and every principal should be
`implicitDeny` for `iam:CreateUser`.

Then exercise each path for real, because of the silent-failure mode described above:

| Principal             | Exercise                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phylopic-ses-sender` | Request a magic link; confirm the mail arrives                                                                                                                                    |
| `phylopic-contribute` | Request a magic link, redeem it (token should be consumed), request another link, list your submissions, patch one, delete one, and view an unpublished thumbnail (this presigns) |
| `phylopic-www`        | Create a collection permalink, then load it                                                                                                                                       |
| `phylopic-editorial`  | In `edit`, accept a submission (cross-bucket copy) and delete an image file; run `yarn make` in `publish` far enough to list source images                                        |

## Operator notes

- **`apps/publish`** uses the ambient AWS CLI profile for S3 sync, SSM, CloudFront, and Lambda
  — not the `S3_*` variables in `.env`. Treat it as an operator-only tool run from a trusted
  workstation.
- **`apps/api`** already uses an IAM role (`phylopic-api-executor`) with no static keys. That
  is the preferred model wherever the runtime supports it.
