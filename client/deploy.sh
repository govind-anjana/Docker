#!/bin/bash

echo "Starting deployment..."

cd /srv/apps/user

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Deployment completed!"
