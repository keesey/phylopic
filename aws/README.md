# _PhyloPic_ AWS Principals

Least-privilege IAM users for the applications that authenticate to AWS with static access
keys, replacing the single `Administrator` credential that every one of them shared.

That shared credential carried `AdministratorAccess`. These policies scope each application to
what its code actually calls, so a compromised key cannot take over the whole account.

[`create-principals.sh`](./create-principals.sh) creates the four users and attaches the
policies in [`policies/`](./policies). It does not create access keys; see
[Rolling out](#rolling-out).

## The principals

| User                  | Key goes in                                            | Can do                                                                              |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `phylopic-ses-sender` | `SES_*` in `apps/contribute` (local; Vercel uses OIDC) | Send mail as `keesey+phylopic@gmail.com`, nothing else                              |
| `phylopic-contribute` | `S3_*` in `apps/contribute` (local; Vercel uses OIDC)  | Auth tokens, submission metadata, read source images                                |
| `phylopic-www`        | `S3_*` in `apps/www` (local; Vercel uses OIDC)         | Read and write `permalinks.phylopic.org/data/*`                                     |
| `phylopic-editorial`  | `apps/edit` (local only)                               | Full read/write on submissions and source images                                    |
| `phylopic-publish`    | `AWS_PROFILE` for `apps/publish` `yarn make` (local)   | Release pipeline: S3 sync, entities build, SSM, Lambda env, CloudFront invalidation |

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

`apps/publish` lists `source-images.phylopic.org/images/` during `yarn insert` (see
[`phylopic-publish.json`](./policies/phylopic-publish.json) — no longer via `phylopic-editorial`).

`apps/contribute` needs `GetObject` on `images/*` — not to serve bytes, but because
`getSourceImageFileURL.ts` presigns a link for the unpublished-image thumbnail. **A presigned
URL carries the signer's authority**, so the permission has to exist on the signing principal
even though the browser performs the fetch.

### `images.phylopic.org`, `entities.phylopic.org` — publication pipeline

`apps/publish` `yarn make` syncs public silhouettes to `images.phylopic.org` (CLI `aws s3 sync`
with `public-read` ACL), writes entity JSON under `{build}/` on `entities.phylopic.org`, reads
and deletes old build prefixes, updates SSM build parameters, patches Lambda env on
`phylopic-api-prod-static` and `phylopic-api-prod-dynamic`, and invalidates the API CloudFront
distribution. All of that runs through **`AWS_PROFILE=phylopic-publish`** (default credential
chain), not `phylopic-editorial`. Policy: [`phylopic-publish.json`](./policies/phylopic-publish.json).

`Lambda UpdateFunctionConfiguration` remains high-impact (can rewrite function environment
variables) but is limited to the two API functions and is far narrower than `AdministratorAccess`.

### SES

One call site: `apps/contribute/src/auth/smtp/sendAuthEmail.ts` sends a `SendEmail` with
`Source: keesey+phylopic@gmail.com`. IAM must grant `ses:SendEmail` on the **verified SES
identity** (`keesey@gmail.com` — Gmail treats the plus-address as that identity for
authorization). The `ses:FromAddress` condition still restricts the sender to
`keesey+phylopic@gmail.com` so the credential cannot send as any other verified address.

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

    1. `phylopic-editorial` → `apps/edit/.env.local`. Local only.
    2. `phylopic-publish` → operator `~/.aws/credentials` profile for `apps/publish` (see below).
    3. `phylopic-www` → `apps/www/.env.local` (Vercel uses OIDC).
    4. `phylopic-contribute` and `phylopic-ses-sender` → `apps/contribute/.env.local` (Vercel uses OIDC).

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
| `phylopic-editorial`  | In `edit`, accept a submission (cross-bucket copy) and delete an image file                                                                                                       |
| `phylopic-publish`    | From `apps/publish`, run `yarn make:data` on a test build (or full `yarn make` when ready): entities S3 write, SSM update, Lambda env patch, CloudFront invalidation, image sync  |

## Operator notes

- **`apps/publish`** uses **`AWS_PROFILE=phylopic-publish`** (or the same keys in
  `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) for all AWS work in `yarn make`: CLI
  `aws s3 sync`, entities JSON, SSM, Lambda, and CloudFront. `SourceClient` uses the same
  credential chain when `S3_*` is omitted from `apps/publish/.env`. Do not run `yarn make`
  with the administrator profile once this principal is configured.
- **`apps/edit`** uses `phylopic-editorial` only.
- **`apps/api`** already uses an IAM role (`phylopic-api-executor`) with no static keys. That
  is the preferred model wherever the runtime supports it.
- **Vercel deployments** use `AWS_ROLE_ARN` with OIDC (`@vercel/functions/oidc` in app code).
  Static `S3_*` / `SES_*` keys are for **local** `.env.local` only after OIDC rollout.

## Retiring Vercel static keys

After OIDC is live and smoke-tested, remove deployment keys in this order:

1. **Vercel:** delete `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and `SES_*` from both projects.
   Redeploy; confirm permalinks (`www`) and magic links (`contribute`).
2. **Soak:** leave production on OIDC only for at least a few days.
3. **Local rotation (if needed):** if the same access key id was pasted into Vercel _and_
   `.env.local`, create a fresh local-only key before retiring the old one:

    ```sh
    ./retire-vercel-scoped-keys.sh rotate-local phylopic-www
    ./retire-vercel-scoped-keys.sh rotate-local phylopic-contribute
    ./retire-vercel-scoped-keys.sh rotate-local phylopic-ses-sender
    ```

    Update `apps/www/.env.local` and `apps/contribute/.env.local`; verify local dev.

4. **Retire IAM keys** used only by Vercel (does not touch `phylopic-editorial`):

    ```sh
    ./retire-vercel-scoped-keys.sh status
    ./retire-vercel-scoped-keys.sh deactivate phylopic-www AKIA...
    ./retire-vercel-scoped-keys.sh deactivate phylopic-contribute AKIA...
    ./retire-vercel-scoped-keys.sh deactivate phylopic-ses-sender AKIA...
    ```

    Deactivation is reversible. After another soak with inactive keys, delete each:

    ```sh
    ./retire-vercel-scoped-keys.sh delete phylopic-www AKIA...
    ```

[`retire-vercel-scoped-keys.sh`](./retire-vercel-scoped-keys.sh) lists last-used times to help
pick which key id to retire.

## `phylopic-publish` operator profile

1. Apply the user and policy: `./create-principals.sh` (includes `phylopic-publish`).
2. Create an access key (once): `aws iam create-access-key --user-name phylopic-publish`
3. Add to `~/.aws/credentials`:

    ```ini
    [phylopic-publish]
    aws_access_key_id = AKIA...
    aws_secret_access_key = ...
    region = us-west-2
    ```

4. Run publish — set `AWS_PROFILE=phylopic-publish` on the relevant scripts in `apps/publish/package.json`:

    ```sh
    cd apps/publish
    yarn make
    ```

5. Optional: remove `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and `S3_REGION` from
   `apps/publish/.env` — `SourceClient` falls back to the same profile.

Tighten CloudFront if desired: replace `distribution/*` in [`phylopic-publish.json`](./policies/phylopic-publish.json)
with `distribution/YOUR_API_CLOUDFRONT_DISTRIBUTION_ID` (same value as `API_CLOUDFRONT_DISTRIBUTION_ID` in `.env`).

## Source-data backups

Routine backups of Postgres `phylopic-source` (RDS instance `phylopic`) and
`source-images.phylopic.org` are documented in [`BACKUP.md`](./BACKUP.md). Apply
with [`backup/enable-backups.sh`](./backup/enable-backups.sh). App principals in
this folder are not granted the replica bucket.
