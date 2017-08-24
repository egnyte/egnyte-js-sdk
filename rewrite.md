# rewrite v4

## core

/core contains all parts of the SDK

sdk is bundled with functionality by plugging it. see /plug/fs.js and readme in there. See also src/index.js

API functionality is in files in /src/api

~tpl.js has a template for building more by copy-pasting

## Testing

we're rewriting this to use mocha as test runner.

/spec contains old tests (links are passing after fixes, most other should be possible to fix while the API is changing)

tests are using src/slim.js as egnyte sdk, but it's temporary

/test will hold new ones with mocha

run selected old tests: grunt test-node --filter links
