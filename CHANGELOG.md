### 2.10.1
- fix crash on timer end non-existing response.

### 2.10.0
- add feature to set header "X-Egnyte-Request-Id"
  
### 2.9.0
- update documentation
- prevent upload retry when quota exceeded

### 2.8.0
- update request
- add new .lock() method signature

### 2.7.1
- update request
- merge fix for postmessage handler
- remove npm-shrinkwrap

### 2.7.0
- update dependencies to remove security warnings (coming from test dependencies, no threats found in directly used code)
- add getCurrentFolder to filepicker
- add navigation callback to filepicker

### 2.6.4
- fix for IE11 with activeElement being truthy, but not a DOM node

### 2.6.3
- css fix in filepicker

### 2.6.2
- minor fixes to filepicker UI, option to show files when not selectable

### 2.6.1
- fix regression in filepicker selection format

### 2.6.0
- improve single selection in filepicker

### 2.5.1
- update dependencies to fix installation issues and security

### 2.5.0
- add parents to API.storeage

### 2.4.2
- bugfix release

### 2.4.1
- consistent errors in API.user methods for user not found

### 2.4.0
- added API.user methods for getting user metadata

### 2.3.2
- removed unused uintegrate plugin export version

### 2.3.1
- low level utility exposed allowing overriding any http request options

### 2.3.0
- Added search support
- Added search bar to filepicker widget

### 2.2.0
- Switched all uploads to multipart (browser: if supported)

### 2.1.1
- Removed two more restrictions on characters in paths + and #

### 2.1.0
- Updated all dependencies to newer versions, compatible with node.js v4+
- Ampersand (&) character is now allowed in paths
- disabled chunkned upload test; chunk minimum size of 100MB was introduced in API

### 2.0.0
- Change in resource identification for files and folders
- Separated notes API
- UIntegrate plugin for Egnyte UI Integration Framework

### 1.4.2 - 1.4.4
- bugfixes

### 1.4.1
- optional token scoping

### 1.4.0
- Events API
- Locks in storage
- request defaults

### 1.3.0
- Notes for files
- Prompt widget
- Auth flow with prompt for Egnyte domain
- Plugins support beta
- Unified docs content for browser and node
- Updated xhr to 2.0

### 1.2.0
- Password Grant flow for auth in node.js
- Chunked upload (with streams for node)

### 1.1.0
- Streamed download for node.js
- Impersonation
- Permissions API
- Dropped deprecated section of filepicker
- Setting to disable selection in matching folders in filepicker

### 1.0.1
Basic FS and Link API support with Implicit Grant flow for auth.
