#!/bin/sh

npm i -g typescript
cd client
npm i
tsc
cd ..
cd server
npm i
tsc
node dist/index.js