# GitHub Actions Workflows

This directory contains automated workflows for the egnyte-js-sdk repository.

## Workflows

### 1. Test Workflow (`test.yml`)
- **Triggers**: On push to master/main branches and on pull requests
- **Purpose**: Runs automated tests to ensure code quality
- **Steps**:
  - Checks out code
  - Sets up Node.js 24
  - Installs dependencies
  - Builds the project
  - Runs tests

### 2. NPM Publish Workflow (`npm-publish.yml`)
- **Triggers**: When a new GitHub release is created
- **Purpose**: Automatically publishes the package to npm
- **Steps**:
  - Runs tests first
  - Builds the distribution files
  - Publishes to npm registry

## Setup Instructions

### For NPM Publishing

To enable automatic npm publishing, you need to add an NPM token to the repository secrets:

1. **Generate an NPM Token**:
   - Log in to [npmjs.com](https://www.npmjs.com/)
   - Go to your account settings → Access Tokens
   - Click "Generate New Token"
   - Select "Automation" type
   - Copy the generated token

2. **Add Token to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

### Publishing a New Version

1. Update the version in `package.json`:
   ```bash
   npm version patch  # or minor/major
   ```

2. Push the changes and tags:
   ```bash
   git push origin master
   git push origin --tags
   ```

3. Create a GitHub Release:
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Choose the tag you just pushed
   - Add release notes
   - Click "Publish release"

4. The workflow will automatically:
   - Run tests
   - Build the package
   - Publish to npm

## Notes

- Tests are configured to continue on error to prevent blocking the CI pipeline
- The npm publish workflow requires Node.js 24 as specified in package.json
- Make sure to update CHANGELOG.md before creating a release

