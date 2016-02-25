#!/bin/bash

git clone --depth=1 ssh://git@git.egnyte-internal.com/integrations/pint-runner-environment.git
cp ./pint-runner-environment/egnyte-js-sdk/apiaccess.js ./spec/conf/
killall node || true
npm install
grunt test
