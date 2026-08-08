#!/usr/bin/env bash
#
# Creates the four least-privilege IAM users that replace the shared `Administrator`
# credential in the applications' environment variables.
#
# Safe to re-run: users are created only if absent, and `put-user-policy` overwrites
# the inline policy in place rather than accumulating versions.
#
# Deliberately does NOT create access keys. Key material should be generated one user
# at a time and pasted straight into its destination, so it never sits in shell history
# or a file that gets forgotten. See "Rolling out" in ./README.md.
#
# Run with a credential that can manage IAM (the `Administrator` profile).

set -euo pipefail

cd "$(dirname "$0")"

# Inline rather than managed policies: there is exactly one consumer of each, so the
# indirection of a standalone policy ARN buys nothing, and an inline policy cannot be
# left attached to something else by accident after the user is deleted.
for user in phylopic-ses-sender phylopic-contribute phylopic-www phylopic-editorial; do
    if aws iam get-user --user-name "$user" >/dev/null 2>&1; then
        echo "user $user: exists"
    else
        aws iam create-user --user-name "$user" \
            --tags "Key=Project,Value=PhyloPic" "Key=ManagedBy,Value=aws/create-principals.sh" \
            >/dev/null
        echo "user $user: created"
    fi

    aws iam put-user-policy \
        --user-name "$user" \
        --policy-name "$user" \
        --policy-document "file://policies/$user.json"
    echo "user $user: policy applied"
done

echo
echo "Done. No access keys were created; see README.md for the rollout order."
