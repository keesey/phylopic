#!/usr/bin/env bash
#
# Retires IAM access keys for the three scoped users that Vercel used before OIDC.
# Does NOT touch phylopic-editorial (local edit/publish only).
#
# Run only after:
#   1. Static S3_* / SES_* env vars are removed from both Vercel projects.
#   2. Both projects redeployed and smoke-tested on AWS_ROLE_ARN (permalinks + magic links).
#   3. A soak period with no regressions.
#
# If the same access key is in Vercel and local .env.local, rotate local first:
#   ./retire-vercel-scoped-keys.sh rotate-local phylopic-www
#   (update apps/www/.env.local, verify local dev, then deactivate the old key id)
#
# Run with a credential that can manage IAM (the Administrator profile).

set -euo pipefail

cd "$(dirname "$0")"

VERCEL_USERS=(phylopic-www phylopic-contribute phylopic-ses-sender)

usage() {
    cat <<'EOF'
Usage: ./retire-vercel-scoped-keys.sh <command> [args]

Commands:
  status                          List access keys and last-used times (default).
  rotate-local <user>             Create a new access key for local .env (secret shown once).
  deactivate <user> <access-key-id>
                                  Deactivate one key (reversible; preferred first step).
  delete <user> <access-key-id>   Permanently delete an inactive key.

Users: phylopic-www, phylopic-contribute, phylopic-ses-sender

Examples:
  ./retire-vercel-scoped-keys.sh status
  ./retire-vercel-scoped-keys.sh rotate-local phylopic-contribute
  ./retire-vercel-scoped-keys.sh deactivate phylopic-www AKIAEXAMPLE
  ./retire-vercel-scoped-keys.sh delete phylopic-www AKIAEXAMPLE

See README.md § Retiring Vercel static keys.
EOF
}

require_vercel_user() {
    local user=$1
    local ok=0
    for u in "${VERCEL_USERS[@]}"; do
        if [[ "$u" == "$user" ]]; then
            ok=1
            break
        fi
    done
    if [[ "$ok" -eq 0 ]]; then
        echo "error: $user is not a Vercel-scoped user (use: ${VERCEL_USERS[*]})" >&2
        exit 1
    fi
}

cmd_status() {
    echo "Vercel-scoped IAM users (OIDC replaces these keys in deployment):"
    echo
    for user in "${VERCEL_USERS[@]}"; do
        echo "== $user =="
        if ! aws iam get-user --user-name "$user" >/dev/null 2>&1; then
            echo "  (user not found)"
            echo
            continue
        fi
        local keys_json
        keys_json=$(aws iam list-access-keys --user-name "$user")
        local count
        count=$(echo "$keys_json" | jq '.AccessKeyMetadata | length')
        if [[ "$count" -eq 0 ]]; then
            echo "  no access keys"
            echo
            continue
        fi
        echo "$keys_json" | jq -r '.AccessKeyMetadata[] | "  \(.AccessKeyId)  \(.Status)  created \(.CreateDate)"'
        echo "$keys_json" | jq -r '.AccessKeyMetadata[].AccessKeyId' | while read -r key_id; do
            local last_used
            last_used=$(aws iam get-access-key-last-used --access-key-id "$key_id" \
                --query 'AccessKeyLastUsed.LastUsedDate' --output text 2>/dev/null || echo "None")
            if [[ "$last_used" == "None" || "$last_used" == "null" ]]; then
                echo "    $key_id  last used: never"
            else
                echo "    $key_id  last used: $last_used"
            fi
        done
        echo
    done
    echo "Before deactivating: confirm Vercel no longer has S3_* / SES_* and OIDC smoke-tests passed."
    echo "If a key is still in local .env.local, run rotate-local first."
}

cmd_rotate_local() {
    local user=$1
    require_vercel_user "$user"
    echo "Creating a new access key for $user (for local .env only)."
    echo "The secret is shown once. Paste it into the matching .env.local and a password manager."
    echo
    aws iam create-access-key --user-name "$user" --output json | jq .
    echo
    case "$user" in
        phylopic-www)
            echo "Update apps/www/.env.local: S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY"
            ;;
        phylopic-contribute)
            echo "Update apps/contribute/.env.local: S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY"
            ;;
        phylopic-ses-sender)
            echo "Update apps/contribute/.env.local: SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY"
            ;;
    esac
    echo "Verify local dev, then deactivate the superseded key with:"
    echo "  ./retire-vercel-scoped-keys.sh deactivate $user <old-access-key-id>"
}

cmd_deactivate() {
    local user=$1
    local key_id=$2
    require_vercel_user "$user"
    echo "Deactivating $key_id on $user ..."
    aws iam update-access-key --user-name "$user" --access-key-id "$key_id" --status Inactive
    echo "Done. Key is inactive (reversible). After a further soak, delete with:"
    echo "  ./retire-vercel-scoped-keys.sh delete $user $key_id"
}

cmd_delete() {
    local user=$1
    local key_id=$2
    require_vercel_user "$user"
    local status
    status=$(aws iam list-access-keys --user-name "$user" \
        --query "AccessKeyMetadata[?AccessKeyId=='$key_id'].Status | [0]" --output text)
    if [[ "$status" == "Active" ]]; then
        echo "error: $key_id is still Active; deactivate it first." >&2
        exit 1
    fi
    if [[ "$status" != "Inactive" ]]; then
        echo "error: access key $key_id not found on $user." >&2
        exit 1
    fi
    echo "Permanently deleting inactive key $key_id on $user ..."
    aws iam delete-access-key --user-name "$user" --access-key-id "$key_id"
    echo "Done."
}

command=${1:-status}
shift || true

case "$command" in
    status | -h | --help)
        if [[ "$command" == "-h" || "$command" == "--help" ]]; then
            usage
        else
            cmd_status
        fi
        ;;
    rotate-local)
        [[ $# -eq 1 ]] || { usage; exit 1; }
        cmd_rotate_local "$1"
        ;;
    deactivate)
        [[ $# -eq 2 ]] || { usage; exit 1; }
        cmd_deactivate "$1" "$2"
        ;;
    delete)
        [[ $# -eq 2 ]] || { usage; exit 1; }
        cmd_delete "$1" "$2"
        ;;
    *)
        usage
        exit 1
        ;;
esac
