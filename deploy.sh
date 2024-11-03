#!/bin/bash
sudo git pull
sudo docker build -t my-personal-website .
sudo docker stop my-personal-website-c
sudo docker rm my-personal-website-c
sudo docker run -d -p 3000:3000 --name my-personal-website-c my-personal-website