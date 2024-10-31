FROM node:22
WORKDIR /app
COPY . .
RUN chmod +x build.sh
RUN chmod +x run.sh
SHELL [ "build.sh" ]
EXPOSE 3000
CMD ["bash", "run.sh"]