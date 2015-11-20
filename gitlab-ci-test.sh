#!/bin/bash

git clone --depth=1 ssh://git@egnyte-git.egnyte.com:2022/integrations/pint-runner-environment.git
cp ./pint-runner-environment/egnyte-js-sdk/access.js ./spec/conf/
killall node || true
npm install
grunt test
