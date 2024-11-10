git pull
docker build -t my-personal-website .
docker stop my-personal-website-c
docker rm my-personal-website-c
docker run -d -p 3000:3000 --name my-personal-website-c my-personal-website