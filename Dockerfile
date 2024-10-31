FROM node:22
WORKDIR /app
COPY . .
RUN chmod +x buildrun.sh
SHELL [ "build.sh" ]
EXPOSE 3000
CMD ["bash", "buildrun.sh"]