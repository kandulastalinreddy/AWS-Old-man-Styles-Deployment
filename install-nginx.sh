#!/bin/bash
# Run once on the base EC2 instance (Amazon Linux 2023), then capture it as a custom AMI.
set -e

sudo dnf update -y
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# Deploy the custom page
sudo cp ~/website/index.html /usr/share/nginx/html/index.html
sudo systemctl restart nginx

echo "Nginx is running. Test: curl http://localhost"
