# Source-data backups

Routine backups of the system of record: Postgres `phylopic-source` on RDS instance
`phylopic` (`db.t3.micro`, `us-west-2`) and accepted files in
[`source-images.phylopic.org`](../S3.md). Published derivatives (`images.phylopic.org`,
`entities.phylopic.org`, `phylopic-entities`) are rebuilt by `yarn make` and are not
backed up separately. Pending uploads in `uploads.phylopic.org` are out of scope.

Same AWS account (`960039257217`). Protection is versioning, snapshots, and a replica
bucket — not a second account.

Apply with [`backup/enable-backups.sh`](./backup/enable-backups.sh). Run with a
credential that can manage RDS, IAM, S3, AWS Backup, SNS, and CloudWatch (the
`Administrator` profile).

## What gets enabled

| Layer                              | What                                                       | Retention                                                            |
| ---------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| RDS automated backups + PITR       | Instance `phylopic` (both databases)                       | 14 days, or keep a longer value already set                          |
| AWS Backup vault `phylopic-source` | Weekly snapshot                                            | 90 days, copied to `us-east-1`                                       |
| Same vault                         | Monthly snapshot                                           | 365 days, copied to `us-east-1`                                      |
| S3 versioning                      | `source-images.phylopic.org`                               | Noncurrent versions: Glacier IR after 90 days, expire after 365 days |
| S3 CRR                             | Replica `source-images-backup.phylopic.org` in `us-east-1` | Same lifecycle                                                       |

RDS cannot snapshot one database. A restore always brings up a throwaway instance, then
`pg_dump` of `phylopic-source` only. `phylopic-entities` on that instance can be ignored
or rebuilt later.

The script never writes `PreferredBackupWindow`. App IAM users
([`policies/`](./policies)) are not granted the replica bucket; the replica policy
explicitly denies them.

SNS topic `phylopic-backup` emails `keesey+phylopic@gmail.com` (override with
`BACKUP_NOTIFY_EMAIL`) on AWS Backup job failures and on a sharp drop in source-image
object count. Confirm the subscription email after the first `enable`.

## Inspect first

Capture live settings before changing anything. The enable path prints this same
summary and does not overwrite an existing RDS backup window.

```sh
cd aws/backup
./enable-backups.sh inspect
```

Confirm:

1. **RDS `phylopic`:** `BackupRetentionPeriod`, `PreferredBackupWindow`,
   `DeletionProtection`, `StorageEncrypted`, `LatestRestorableTime`. If retention is
   already greater than 14 days, leave it. If it is `0`, the first enable starts a full
   backup and PITR is unavailable until that backup finishes.
2. **`source-images.phylopic.org`:** versioning, replication, lifecycle. Enabling
   versioning cannot be fully undone (only suspended). Replacing lifecycle overwrites
   any existing rules on that bucket.
3. **Replica bucket** `source-images-backup.phylopic.org` — whether it already exists
   in `us-east-1`.
4. **AWS Backup** vaults and plan named `phylopic-source`.

Then apply (idempotent):

```sh
./enable-backups.sh enable
```

Cross-region replication copies **new** writes. Seed current objects once:

```sh
./enable-backups.sh seed-replica
```

Existing objects are synced as current versions only; later overwrites and deletes
replicate with version history.

## Restore

Do not restore onto the live instance. Always restore to a throwaway RDS instance,
dump `phylopic-source`, and only then load into live. `phylopic_source` cannot run
`pg_restore --clean` (no `DELETE`, not the owner). Use the database owner (`master`
in [sql/phylopic-source.sql](../sql/phylopic-source.sql)).

Before any load into live: take a fresh RDS snapshot of `phylopic`, stop editorial
writes (`apps/edit`, `apps/contribute`) if you can, and verify the dump against the
throwaway instance.

Copy subnet group, VPC security groups, and public-accessibility from live:

```sh
aws rds describe-db-instances --db-instance-identifier phylopic \
  --query 'DBInstances[0].{Subnet:DBSubnetGroup.DBSubnetGroupName,SGs:VpcSecurityGroups[*].VpcSecurityGroupId,Public:PubliclyAccessible,Encrypted:StorageEncrypted}'
```

### Database — last 14 days (PITR)

Use this for a bad `UPDATE` or similar when `LatestRestorableTime` still covers the
moment you need.

```sh
RESTORE_ID="phylopic-restore-$(date -u +%Y%m%d%H%M)"

aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier phylopic \
  --target-db-instance-identifier "$RESTORE_ID" \
  --restore-time 2026-08-29T18:00:00Z \
  --db-instance-class db.t3.micro \
  --db-subnet-group-name SUBNET_GROUP \
  --vpc-security-group-ids sg-... \
  --no-publicly-accessible \
  --no-deletion-protection

aws rds wait db-instance-available --db-instance-identifier "$RESTORE_ID"
```

Use `--use-latest-restorable-time` instead of `--restore-time` when you want the
newest PITR point.

```sh
ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "$RESTORE_ID" \
  --query 'DBInstances[0].Endpoint.Address' --output text)

pg_dump -h "$ENDPOINT" -U master -d phylopic-source -Fc -f phylopic-source.dump
```

Inspect, then replace live `phylopic-source` only:

```sh
pg_restore -h "$PGHOST" -U master -d phylopic-source --clean --if-exists phylopic-source.dump
```

For a few tables, add `-t public.image` (and related tables) to `pg_dump` / `pg_restore`
instead of dumping the whole database.

```sh
aws rds delete-db-instance --db-instance-identifier "$RESTORE_ID" --skip-final-snapshot
aws rds wait db-instance-deleted --db-instance-identifier "$RESTORE_ID"
```

### Database — older than PITR (AWS Backup snapshot)

```sh
aws backup list-recovery-points-by-backup-vault \
  --backup-vault-name phylopic-source \
  --by-resource-type RDS \
  --query 'RecoveryPoints[].[RecoveryPointArn,CreationDate,Status]' \
  --output table
```

Restore through AWS Backup (creates a new RDS instance) or from the RDS snapshot the
recovery point refers to:

```sh
aws backup start-restore-job \
  --recovery-point-arn RECOVERY_POINT_ARN \
  --iam-role-arn "arn:aws:iam::960039257217:role/phylopic-backup" \
  --resource-type RDS \
  --metadata "DBInstanceIdentifier=$RESTORE_ID,DBSubnetGroupName=SUBNET_GROUP,VPCSecurityGroups=sg-...,PubliclyAccessible=false,DeletionProtection=false"

aws backup list-copy-jobs --by-resource-type RDS   # if the only copy is in us-east-1
```

Then the same `pg_dump` / `pg_restore` / delete-throwaway path as PITR. Copies in
`us-east-1` use `--region us-east-1` on `list-recovery-points-by-backup-vault`.

### One image

Deleted files are first copied to `trash/` ([`S3Deletor`](../packages/source-client/src/implementations/s3/S3Deletor.ts)).
Try trash, then a prior version:

```sh
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

aws s3api copy-object \
  --bucket source-images.phylopic.org \
  --copy-source "source-images.phylopic.org/trash/images/${UUID}/source" \
  --key "images/${UUID}/source" \
  --server-side-encryption AES256

aws s3api list-object-versions \
  --bucket source-images.phylopic.org \
  --prefix "images/${UUID}/source"

aws s3api copy-object \
  --bucket source-images.phylopic.org \
  --copy-source "source-images.phylopic.org/images/${UUID}/source?versionId=VERSION_ID" \
  --key "images/${UUID}/source" \
  --server-side-encryption AES256
```

If the live bucket is empty or versions are gone, use the same keys on
`source-images-backup.phylopic.org` (`--region us-east-1` to list; `CopySource` can
point at the replica bucket).

### Many images / emptied bucket

```sh
aws s3 sync \
  s3://source-images-backup.phylopic.org \
  s3://source-images.phylopic.org \
  --source-region us-east-1 \
  --region us-west-2
```

Do not pass `--delete` unless you intend to drop live keys that are absent from the
replica. After a source-only restore, run `yarn make` only if the public site and API
must match the restored source.

## Quarterly drill

Do not load into live.

1. `./enable-backups.sh inspect` — latest restorable time is recent; last AWS Backup
   job is `COMPLETED`; replication status is `Enabled`.
2. Restore the newest weekly recovery point to a throwaway instance. `pg_dump`
   `phylopic-source` only; confirm the dump restores into a local or throwaway
   database. Drop the throwaway RDS instance.
3. Put a tiny object at `backup-probe/drill.txt` on the live bucket, wait for it on
   the replica, delete it on live, confirm the prior version remains, then delete the
   probe prefix (including versions) on both buckets.
4. Confirm the SNS subscription is `Confirmed`.

Record the date outside this repo (password manager or calendar). The probe prefix is
never used by the apps.

## Verification (after first enable)

```sh
aws rds describe-db-instances --db-instance-identifier phylopic \
  --query 'DBInstances[0].{Retention:BackupRetentionPeriod,PITR:LatestRestorableTime,DeletionProtection:DeletionProtection}'

aws backup list-backup-jobs --by-resource-type RDS --max-results 5

aws s3api get-bucket-versioning --bucket source-images.phylopic.org
aws s3api get-bucket-replication --bucket source-images.phylopic.org

aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::960039257217:user/phylopic-editorial \
  --action-names s3:PutObject \
  --resource-arns arn:aws:s3:::source-images-backup.phylopic.org/images/probe/source
```

`phylopic-editorial` and `phylopic-publish` must be `implicitDeny` or `explicitDeny` on
the replica. Confirm the SNS email and, once S3 daily metrics exist (often 24–48 hours),
that alarm `phylopic-source-images-object-count-drop` is `OK` or `INSUFFICIENT_DATA`.
