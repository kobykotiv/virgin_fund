#!/bin/bash

# This script sets up the development environment for Virgin Fund

# Exit on error
set -e

echo "Setting up development environment for Virgin Fund..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)
if [ $NODE_MAJOR_VERSION -lt 16 ]; then
    echo "Node.js v$NODE_VERSION is not supported. Please upgrade to v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create necessary directories if they don't exist
mkdir -p build

# Copy environment variables
echo "Setting up environment variables..."
cp .env.development .env.local

# Ensure scripts are executable
chmod +x scripts/*.sh

echo "Development environment setup complete!"
echo "You can start the development server with: npm start"
