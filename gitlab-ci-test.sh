#!/bin/bash

killall node || true
npm install
grunt test
