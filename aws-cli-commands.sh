#!/bin/bash
# Reference AWS CLI commands used in this project. Replace placeholders before running.
REGION="ap-south-2"

# --- S3: upload static content ---
aws s3 mb s3://YOUR-BUCKET-NAME --region $REGION
aws s3 sync ./website s3://YOUR-BUCKET-NAME --region $REGION

# --- SNS: topic + email subscriber for Auto Scaling notifications ---
aws sns create-topic --name asg-notifications --region $REGION
aws sns subscribe \
  --topic-arn arn:aws:sns:$REGION:ACCOUNT_ID:asg-notifications \
  --protocol email \
  --notification-endpoint you@example.com \
  --region $REGION
# Then confirm the subscription from the email AWS sends you.

# --- Auto Scaling: send scaling events to the SNS topic ---
aws autoscaling put-notification-configuration \
  --auto-scaling-group-name YOUR-ASG-NAME \
  --topic-arn arn:aws:sns:$REGION:ACCOUNT_ID:asg-notifications \
  --notification-types "autoscaling:EC2_INSTANCE_LAUNCH" "autoscaling:EC2_INSTANCE_TERMINATE" \
  --region $REGION
