#!/usr/bin/env bash
#
# Enables same-account backups for phylopic-source (RDS instance phylopic) and
# source-images.phylopic.org. Safe to re-run: existing resources are updated in
# place rather than duplicated.
#
# Does not set PreferredBackupWindow. Raises BackupRetentionPeriod to 14 only
# when the current value is lower, so a longer window already chosen is kept.
#
# Run with a credential that can manage RDS, IAM, S3, AWS Backup, SNS, and
# CloudWatch (the Administrator profile). See ../BACKUP.md.
#
# Usage:
#   ./enable-backups.sh              # inspect (default)
#   ./enable-backups.sh inspect
#   ./enable-backups.sh enable
#   ./enable-backups.sh seed-replica

set -euo pipefail

cd "$(dirname "$0")"

EXPECTED_ACCOUNT=960039257217
LIVE_REGION=us-west-2
REPLICA_REGION=us-east-1
DB_INSTANCE=phylopic
LIVE_BUCKET=source-images.phylopic.org
REPLICA_BUCKET=source-images-backup.phylopic.org
VAULT_NAME=phylopic-source
PLAN_NAME=phylopic-source
SELECTION_NAME=phylopic-rds
BACKUP_ROLE=phylopic-backup
REPLICATION_ROLE=phylopic-s3-replication
SNS_TOPIC=phylopic-backup
ALARM_NAME=phylopic-source-images-object-count-drop
NOTIFY_EMAIL=${BACKUP_NOTIFY_EMAIL:-keesey+phylopic@gmail.com}
MIN_RETENTION=14

TAGS="Key=Project,Value=PhyloPic Key=ManagedBy,Value=aws/backup/enable-backups.sh"

is_blank() {
    [[ -z "${1:-}" || "$1" == "None" || "$1" == "null" ]]
}

require_account() {
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    if [[ "$ACCOUNT_ID" != "$EXPECTED_ACCOUNT" ]]; then
        echo "error: expected account $EXPECTED_ACCOUNT, got $ACCOUNT_ID" >&2
        exit 1
    fi
}

usage() {
    cat <<'EOF'
Usage: ./enable-backups.sh [inspect|enable|seed-replica]

  inspect        Print live RDS, S3, AWS Backup, SNS, and alarm settings (default).
  enable         Apply PITR, AWS Backup, S3 versioning/CRR/lifecycle, SNS, alarm.
  seed-replica   Sync current source-images objects to the us-east-1 replica.

See ../BACKUP.md.
EOF
}

# ---------------------------------------------------------------------------
# inspect
# ---------------------------------------------------------------------------

inspect_rds() {
    echo "== RDS $DB_INSTANCE ($LIVE_REGION) =="
    if ! aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE" --region "$LIVE_REGION" >/dev/null 2>&1; then
        echo "  (instance not found)"
        echo
        return
    fi
    aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE" --region "$LIVE_REGION" \
        --query 'DBInstances[0].{
            Class:DBInstanceClass,
            Status:DBInstanceStatus,
            BackupRetentionPeriod:BackupRetentionPeriod,
            PreferredBackupWindow:PreferredBackupWindow,
            DeletionProtection:DeletionProtection,
            StorageEncrypted:StorageEncrypted,
            LatestRestorableTime:LatestRestorableTime,
            MultiAZ:MultiAZ
        }' \
        --output table
    echo
}

inspect_s3_bucket() {
    local bucket=$1
    local region=$2
    echo "== S3 $bucket ($region) =="
    if ! aws s3api head-bucket --bucket "$bucket" --region "$region" >/dev/null 2>&1; then
        echo "  (bucket not found)"
        echo
        return
    fi
    echo "  versioning: $(aws s3api get-bucket-versioning --bucket "$bucket" --region "$region" --query 'Status' --output text)"
    local repl
    if repl=$(aws s3api get-bucket-replication --bucket "$bucket" --region "$region" 2>/dev/null); then
        echo "$repl" | jq -r '"  replication: \(.ReplicationConfiguration.Rules[0].Status) -> \(.ReplicationConfiguration.Rules[0].Destination.Bucket)"'
    else
        echo "  replication: (none)"
    fi
    if aws s3api get-bucket-lifecycle-configuration --bucket "$bucket" --region "$region" >/dev/null 2>&1; then
        aws s3api get-bucket-lifecycle-configuration --bucket "$bucket" --region "$region" \
            --query 'Rules[].{ID:ID,Status:Status}' --output table
    else
        echo "  lifecycle: (none)"
    fi
    echo
}

inspect_backup() {
    echo "== AWS Backup ($LIVE_REGION) =="
    if aws backup get-backup-vault --backup-vault-name "$VAULT_NAME" --region "$LIVE_REGION" >/dev/null 2>&1; then
        echo "  vault $VAULT_NAME: exists"
    else
        echo "  vault $VAULT_NAME: (none)"
    fi
    local plan_id
    plan_id=$(aws backup list-backup-plans --region "$LIVE_REGION" \
        --query "BackupPlansList[?BackupPlanName=='$PLAN_NAME'].BackupPlanId | [0]" --output text)
    if is_blank "$plan_id"; then
        echo "  plan $PLAN_NAME: (none)"
    else
        echo "  plan $PLAN_NAME: $plan_id"
        aws backup list-backup-jobs --region "$LIVE_REGION" --by-backup-vault-name "$VAULT_NAME" --max-results 3 \
            --query 'BackupJobs[].{Created:CreationDate,Status:State,Resource:ResourceType}' \
            --output table 2>/dev/null || echo "  (no recent jobs)"
    fi
    echo
    echo "== AWS Backup ($REPLICA_REGION) =="
    if aws backup get-backup-vault --backup-vault-name "$VAULT_NAME" --region "$REPLICA_REGION" >/dev/null 2>&1; then
        echo "  vault $VAULT_NAME: exists"
    else
        echo "  vault $VAULT_NAME: (none)"
    fi
    echo
}

inspect_sns_alarm() {
    echo "== SNS $SNS_TOPIC ($LIVE_REGION) =="
    local topic_arn
    topic_arn=$(aws sns list-topics --region "$LIVE_REGION" \
        --query "Topics[?contains(TopicArn, ':$SNS_TOPIC')].TopicArn | [0]" --output text)
    if is_blank "$topic_arn"; then
        echo "  (topic not found)"
    else
        echo "  $topic_arn"
        aws sns list-subscriptions-by-topic --topic-arn "$topic_arn" --region "$LIVE_REGION" \
            --query 'Subscriptions[].{Protocol:Protocol,Endpoint:Endpoint,Arn:SubscriptionArn}' \
            --output table
    fi
    echo
    echo "== CloudWatch alarm $ALARM_NAME =="
    if aws cloudwatch describe-alarms --alarm-names "$ALARM_NAME" --region "$LIVE_REGION" \
        --query 'MetricAlarms[0].AlarmName' --output text 2>/dev/null | grep -qx "$ALARM_NAME"; then
        aws cloudwatch describe-alarms --alarm-names "$ALARM_NAME" --region "$LIVE_REGION" \
            --query 'MetricAlarms[0].{State:StateValue,Updated:StateUpdatedTimestamp}' \
            --output table
    else
        echo "  (alarm not found)"
    fi
    echo
}

cmd_inspect() {
    require_account
    echo "account $ACCOUNT_ID"
    echo
    inspect_rds
    inspect_s3_bucket "$LIVE_BUCKET" "$LIVE_REGION"
    inspect_s3_bucket "$REPLICA_BUCKET" "$REPLICA_REGION"
    inspect_backup
    inspect_sns_alarm
}

# ---------------------------------------------------------------------------
# enable
# ---------------------------------------------------------------------------

ensure_backup_role() {
    if aws iam get-role --role-name "$BACKUP_ROLE" >/dev/null 2>&1; then
        echo "role $BACKUP_ROLE: exists"
    else
        aws iam create-role \
            --role-name "$BACKUP_ROLE" \
            --assume-role-policy-document file://backup-trust.json \
            --tags $TAGS \
            >/dev/null
        echo "role $BACKUP_ROLE: created"
    fi
    aws iam attach-role-policy \
        --role-name "$BACKUP_ROLE" \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup
    aws iam attach-role-policy \
        --role-name "$BACKUP_ROLE" \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores
    echo "role $BACKUP_ROLE: backup policies attached"
}

ensure_replication_role() {
    if aws iam get-role --role-name "$REPLICATION_ROLE" >/dev/null 2>&1; then
        echo "role $REPLICATION_ROLE: exists"
    else
        aws iam create-role \
            --role-name "$REPLICATION_ROLE" \
            --assume-role-policy-document file://replication-trust.json \
            --tags $TAGS \
            >/dev/null
        echo "role $REPLICATION_ROLE: created"
    fi
    aws iam put-role-policy \
        --role-name "$REPLICATION_ROLE" \
        --policy-name "$REPLICATION_ROLE" \
        --policy-document file://replication-policy.json
    echo "role $REPLICATION_ROLE: policy applied"
}

enable_rds() {
    local retention protection
    retention=$(aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE" --region "$LIVE_REGION" \
        --query 'DBInstances[0].BackupRetentionPeriod' --output text)
    protection=$(aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE" --region "$LIVE_REGION" \
        --query 'DBInstances[0].DeletionProtection' --output text)

    local args=(--db-instance-identifier "$DB_INSTANCE" --region "$LIVE_REGION" --apply-immediately)
    local change=0
    if ((retention < MIN_RETENTION)); then
        args+=(--backup-retention-period "$MIN_RETENTION")
        change=1
        echo "RDS $DB_INSTANCE: BackupRetentionPeriod $retention -> $MIN_RETENTION (PreferredBackupWindow left unchanged)"
    else
        echo "RDS $DB_INSTANCE: BackupRetentionPeriod $retention (kept; already >= $MIN_RETENTION)"
    fi
    if [[ "$protection" != "True" && "$protection" != "true" ]]; then
        args+=(--deletion-protection)
        change=1
        echo "RDS $DB_INSTANCE: enabling DeletionProtection"
    else
        echo "RDS $DB_INSTANCE: DeletionProtection already on"
    fi
    if ((change)); then
        aws rds modify-db-instance "${args[@]}" >/dev/null
        echo "RDS $DB_INSTANCE: modify submitted"
    fi
}

enable_backup_opt_in() {
    local region=$1
    aws backup update-region-settings --region "$region" \
        --resource-type-opt-in-preference RDS=true
    echo "AWS Backup: RDS opted in ($region)"
}

ensure_vault() {
    local region=$1
    if aws backup get-backup-vault --backup-vault-name "$VAULT_NAME" --region "$region" >/dev/null 2>&1; then
        echo "vault $VAULT_NAME ($region): exists"
    else
        aws backup create-backup-vault \
            --backup-vault-name "$VAULT_NAME" \
            --region "$region" \
            --backup-vault-tags Project=PhyloPic,ManagedBy=aws/backup/enable-backups.sh \
            >/dev/null
        echo "vault $VAULT_NAME ($region): created"
    fi
}

enable_backup_plan() {
    local dest_arn="arn:aws:backup:${REPLICA_REGION}:${ACCOUNT_ID}:backup-vault:${VAULT_NAME}"
    local plan_json
    plan_json=$(jq --arg dest "$dest_arn" '
        .Rules[].CopyActions[]?.DestinationBackupVaultArn = $dest
    ' backup-plan.json)

    local plan_id
    plan_id=$(aws backup list-backup-plans --region "$LIVE_REGION" \
        --query "BackupPlansList[?BackupPlanName=='$PLAN_NAME'].BackupPlanId | [0]" --output text)

    if is_blank "$plan_id"; then
        plan_id=$(aws backup create-backup-plan --region "$LIVE_REGION" \
            --backup-plan "$plan_json" \
            --backup-plan-tags Project=PhyloPic,ManagedBy=aws/backup/enable-backups.sh \
            --query BackupPlanId --output text)
        echo "plan $PLAN_NAME: created ($plan_id)"
    else
        aws backup update-backup-plan --region "$LIVE_REGION" \
            --backup-plan-id "$plan_id" \
            --backup-plan "$plan_json" \
            >/dev/null
        echo "plan $PLAN_NAME: updated ($plan_id)"
    fi

    local role_arn="arn:aws:iam::${ACCOUNT_ID}:role/${BACKUP_ROLE}"
    local resource_arn="arn:aws:rds:${LIVE_REGION}:${ACCOUNT_ID}:db:${DB_INSTANCE}"
    local selection
    selection=$(jq -n \
        --arg name "$SELECTION_NAME" \
        --arg role "$role_arn" \
        --arg resource "$resource_arn" \
        '{SelectionName:$name,IamRoleArn:$role,Resources:[$resource]}')

    local selection_id
    selection_id=$(aws backup list-backup-selections --backup-plan-id "$plan_id" --region "$LIVE_REGION" \
        --query "BackupSelectionsList[?SelectionName=='$SELECTION_NAME'].SelectionId | [0]" --output text)

    if is_blank "$selection_id"; then
        aws backup create-backup-selection --region "$LIVE_REGION" \
            --backup-plan-id "$plan_id" \
            --backup-selection "$selection" \
            >/dev/null
        echo "selection $SELECTION_NAME: created"
    else
        aws backup update-backup-selection --region "$LIVE_REGION" \
            --backup-plan-id "$plan_id" \
            --selection-id "$selection_id" \
            --backup-selection "$selection" \
            >/dev/null
        echo "selection $SELECTION_NAME: updated"
    fi
}

enable_sns() {
    local topic_arn
    topic_arn=$(aws sns create-topic --name "$SNS_TOPIC" --region "$LIVE_REGION" \
        --tags $TAGS \
        --query TopicArn --output text)
    echo "SNS topic: $topic_arn"

    local policy
    policy=$(jq -n --arg topic "$topic_arn" --arg account "$ACCOUNT_ID" --arg alarm "$ALARM_NAME" --arg region "$LIVE_REGION" '{
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "AllowAWSBackup",
                Effect: "Allow",
                Principal: {Service: "backup.amazonaws.com"},
                Action: "SNS:Publish",
                Resource: $topic
            },
            {
                Sid: "AllowCloudWatch",
                Effect: "Allow",
                Principal: {Service: "cloudwatch.amazonaws.com"},
                Action: "SNS:Publish",
                Resource: $topic,
                Condition: {
                    ArnLike: {
                        "aws:SourceArn": ("arn:aws:cloudwatch:" + $region + ":" + $account + ":alarm:" + $alarm)
                    }
                }
            }
        ]
    }')
    aws sns set-topic-attributes --region "$LIVE_REGION" \
        --topic-arn "$topic_arn" \
        --attribute-name Policy \
        --attribute-value "$policy"

    local existing
    existing=$(aws sns list-subscriptions-by-topic --topic-arn "$topic_arn" --region "$LIVE_REGION" \
        --query "Subscriptions[?Endpoint=='$NOTIFY_EMAIL' && Protocol=='email'].SubscriptionArn | [0]" \
        --output text)
    if is_blank "$existing"; then
        aws sns subscribe --region "$LIVE_REGION" \
            --topic-arn "$topic_arn" \
            --protocol email \
            --notification-endpoint "$NOTIFY_EMAIL" \
            >/dev/null
        echo "SNS: subscribed $NOTIFY_EMAIL (confirm the email)"
    else
        echo "SNS: $NOTIFY_EMAIL already subscribed ($existing)"
    fi

    aws backup put-backup-vault-notifications --region "$LIVE_REGION" \
        --backup-vault-name "$VAULT_NAME" \
        --sns-topic-arn "$topic_arn" \
        --backup-vault-events BACKUP_JOB_FAILED COPY_JOB_FAILED RESTORE_JOB_FAILED
    echo "SNS: vault notifications set"

    TOPIC_ARN=$topic_arn
}

enable_s3() {
    aws s3api put-bucket-versioning \
        --bucket "$LIVE_BUCKET" \
        --region "$LIVE_REGION" \
        --versioning-configuration Status=Enabled
    echo "S3 $LIVE_BUCKET: versioning Enabled"

    if aws s3api head-bucket --bucket "$REPLICA_BUCKET" --region "$REPLICA_REGION" >/dev/null 2>&1; then
        echo "S3 $REPLICA_BUCKET: exists"
    else
        aws s3api create-bucket \
            --bucket "$REPLICA_BUCKET" \
            --region "$REPLICA_REGION" \
            >/dev/null
        echo "S3 $REPLICA_BUCKET: created"
    fi

    aws s3api put-public-access-block \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
    aws s3api put-bucket-ownership-controls \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'
    aws s3api put-bucket-versioning \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --versioning-configuration Status=Enabled
    aws s3api put-bucket-encryption \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --server-side-encryption-configuration '{
            "Rules": [{
                "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
                "BucketKeyEnabled": true
            }]
        }'
    aws s3api put-bucket-tagging \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --tagging 'TagSet=[{Key=Project,Value=PhyloPic},{Key=ManagedBy,Value=aws/backup/enable-backups.sh}]'
    echo "S3 $REPLICA_BUCKET: private, versioned, AES256"

    local deny
    deny=$(jq -n --arg account "$ACCOUNT_ID" --arg bucket "$REPLICA_BUCKET" '{
        Version: "2012-10-17",
        Statement: [{
            Sid: "DenyAppPrincipals",
            Effect: "Deny",
            Principal: {AWS: [
                ("arn:aws:iam::" + $account + ":user/phylopic-ses-sender"),
                ("arn:aws:iam::" + $account + ":user/phylopic-contribute"),
                ("arn:aws:iam::" + $account + ":user/phylopic-www"),
                ("arn:aws:iam::" + $account + ":user/phylopic-editorial"),
                ("arn:aws:iam::" + $account + ":user/phylopic-publish"),
                ("arn:aws:iam::" + $account + ":role/phylopic-api-executor")
            ]},
            Action: "s3:*",
            Resource: [
                ("arn:aws:s3:::" + $bucket),
                ("arn:aws:s3:::" + $bucket + "/*")
            ]
        }]
    }')
    aws s3api put-bucket-policy \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --policy "$deny"
    echo "S3 $REPLICA_BUCKET: app principals denied"

    # IAM role updates are not instantly visible to S3 replication.
    echo "waiting 10s for IAM role propagation"
    sleep 10

    local repl
    repl=$(jq --arg arn "arn:aws:iam::${ACCOUNT_ID}:role/${REPLICATION_ROLE}" '.Role = $arn' replication.json)
    aws s3api put-bucket-replication \
        --bucket "$LIVE_BUCKET" \
        --region "$LIVE_REGION" \
        --replication-configuration "$repl"
    echo "S3 $LIVE_BUCKET: replication to $REPLICA_BUCKET"

    aws s3api put-bucket-lifecycle-configuration \
        --bucket "$LIVE_BUCKET" \
        --region "$LIVE_REGION" \
        --lifecycle-configuration file://lifecycle.json
    aws s3api put-bucket-lifecycle-configuration \
        --bucket "$REPLICA_BUCKET" \
        --region "$REPLICA_REGION" \
        --lifecycle-configuration file://lifecycle.json
    echo "S3: lifecycle applied on live and replica"
}

enable_alarm() {
    aws cloudwatch put-metric-alarm \
        --region "$LIVE_REGION" \
        --alarm-name "$ALARM_NAME" \
        --alarm-description "Daily object count on source-images.phylopic.org fell outside the anomaly band (possible mass delete)." \
        --comparison-operator LessThanLowerThreshold \
        --evaluation-periods 1 \
        --threshold-metric-id ad \
        --treat-missing-data notBreaching \
        --metrics file://object-count-alarm-metrics.json \
        --alarm-actions "$TOPIC_ARN"
    echo "alarm $ALARM_NAME: applied (S3 NumberOfObjects is daily; often INSUFFICIENT_DATA for 24-48h)"
}

cmd_enable() {
    require_account
    echo "account $ACCOUNT_ID — inspect before apply:"
    echo
    inspect_rds
    inspect_s3_bucket "$LIVE_BUCKET" "$LIVE_REGION"
    inspect_s3_bucket "$REPLICA_BUCKET" "$REPLICA_REGION"
    echo "applying..."
    echo
    ensure_backup_role
    ensure_replication_role
    enable_rds
    enable_backup_opt_in "$LIVE_REGION"
    enable_backup_opt_in "$REPLICA_REGION"
    ensure_vault "$LIVE_REGION"
    ensure_vault "$REPLICA_REGION"
    enable_backup_plan
    enable_sns
    enable_s3
    enable_alarm
    echo
    echo "Done. Confirm the SNS email. Seed current images with: ./enable-backups.sh seed-replica"
    echo "See ../BACKUP.md for restore and verification."
}

cmd_seed_replica() {
    require_account
    if ! aws s3api head-bucket --bucket "$REPLICA_BUCKET" --region "$REPLICA_REGION" >/dev/null 2>&1; then
        echo "error: $REPLICA_BUCKET does not exist; run ./enable-backups.sh enable first" >&2
        exit 1
    fi
    echo "syncing s3://$LIVE_BUCKET -> s3://$REPLICA_BUCKET (current objects only; no --delete)"
    aws s3 sync \
        "s3://$LIVE_BUCKET" \
        "s3://$REPLICA_BUCKET" \
        --source-region "$LIVE_REGION" \
        --region "$REPLICA_REGION"
    echo "Done."
}

case "${1:-inspect}" in
    inspect) cmd_inspect ;;
    enable) cmd_enable ;;
    seed-replica) cmd_seed_replica ;;
    -h | --help | help) usage ;;
    *)
        usage >&2
        exit 1
        ;;
esac
