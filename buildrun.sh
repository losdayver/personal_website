#!/bin/sh
npm i -g typescript@5.6.3
cd client
npm i
tsc
cd ..
cd server
npm i
tsc
node dist/index.js