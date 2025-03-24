#!/bin/bash

# EventGo Deployment Script

# Usage information
show_usage() {
  echo "Usage: ./deploy.sh [environment]"
  echo "  environment: dev (default), prod, or docker"
  echo ""
  echo "Examples:"
  echo "  ./deploy.sh dev    - Starts development environment"
  echo "  ./deploy.sh prod   - Builds and starts production environment"
  echo "  ./deploy.sh docker - Builds and starts Docker environment"
  exit 1
}

# Variables
ENV=${1:-dev}

# Check environment
case $ENV in
  dev)
    echo "🚀 Starting development environment..."
    npm run dev
    ;;
    
  prod)
    echo "🏗️  Building production assets..."
    npm run build
    
    echo "🚀 Starting production server..."
    NODE_ENV=production npm start
    ;;
    
  docker)
    echo "🐳 Building and starting Docker containers..."
    docker-compose up -d --build
    
    echo "✅ Docker containers started successfully!"
    echo "📊 Application is running at http://localhost:5001"
    ;;
    
  *)
    echo "❌ Unknown environment: $ENV"
    show_usage
    ;;
esac 