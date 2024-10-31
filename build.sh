#!/bin/sh

cd client
npm i
tsc
cd ..
cd server
npm i
tsc