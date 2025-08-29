name: GitHub Pages CI/CD Configuration

# This file enables GitHub Pages deployment
# The CI/CD pipeline is defined in .github/workflows/ci-cd.yml

# GitHub Pages settings:
# - Source: Deploy from a branch
# - Branch: gh-pages (automatically created by GitHub Actions)
# - Path: / (root)

# The deployment process:
# 1. Code is pushed to main branch
# 2. GitHub Actions workflow triggers
# 3. Application is built for GitHub Pages environment
# 4. Built files are deployed to GitHub Pages
# 5. Site becomes available at: https://vincemic.github.io/ai-customer-service

# Environment-specific settings are configured in:
# - src/environments/environment.github-pages.ts
# - angular.json (github-pages configuration)

# Base href is set to '/ai-customer-service/' for GitHub Pages compatibility