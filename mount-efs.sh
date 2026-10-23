#!/bin/bash
# Mount the shared EFS file system on a web instance.
# Replace EFS_ID with your file system ID (e.g. fs-0123456789abcdef0).
set -e

EFS_ID="fs-0a1b2c3d4e5f67890"
REGION="ap-south-2"
MOUNT_DIR="/usr/share/nginx/efs"

sudo dnf install -y amazon-efs-utils
sudo mkdir -p "$MOUNT_DIR"
sudo mount -t efs -o tls "$EFS_ID":/ "$MOUNT_DIR"

# Persist the mount across reboots
echo "$EFS_ID:/ $MOUNT_DIR efs _netdev,tls 0 0" | sudo tee -a /etc/fstab

echo "EFS mounted at $MOUNT_DIR"
