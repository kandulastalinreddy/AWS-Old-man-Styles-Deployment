# AWS-Old-man-Styles-Deployment
Highly available AWS deployment of the Old Man Styles static website, built as my AWS capstone project.
A highly available, production-style AWS deployment of Old Man Styles, a static clothing brand website, built as my AWS capstone project.

Architecture

Route 53 → CloudFront → S3 (static hosting) Custom VPC → EC2 (Nginx) → Auto Scaling Group → RDS MySQL + EFS

Region: ap-south-2 (Hyderabad)
HTTPS: ACM SSL certificates
Alerting: SNS notifications
Security: least-privilege security groups
AWS Services Used
Service	Purpose
Route 53	DNS, with an alias record pointing to CloudFront
CloudFront	CDN serving the site over HTTPS
S3	Static website hosting
ACM	SSL/TLS certificates
VPC	Custom network with public and private subnets
EC2 + Nginx	Web servers
Auto Scaling Group	Scaling and high availability
RDS (MySQL)	Managed database
EFS	Shared file storage across instances
SNS	Alerts and notifications
Files
File	Description
index.html	Main page of the Old Man Styles website, served by Nginx
script.js	JavaScript for the site's interactive behavior
style.css	Custom styles and layout for the website
install-nginx.sh	Installs and starts Nginx on the base EC2 instance and deploys the site
mount-efs.sh	Mounts the shared EFS file system on the web servers
aws-cli-commands.sh	AWS CLI commands for S3 upload, SNS alerts, and Auto Scaling notifications
Key Learnings
Configuring CloudFront with an S3 website endpoint and a custom domain
Requesting ACM certificates in us-east-1 for CloudFront
Opening NFS port 2049 between the web and EFS security groups
Troubleshooting DNS and domain registry issues
Author

Stalin Reddy K - Data Science graduate | Bengaluru, India
