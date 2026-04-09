#!/bin/bash
# ============================================
# Sanyukt Parivaar - Start Development Server
# ============================================
# Double-click this file or run: bash start.sh

echo "🚀 Starting Sanyukt Parivaar Development Servers..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Start both servers
npm run dev
