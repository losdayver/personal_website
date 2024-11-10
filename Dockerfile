FROM node:22
WORKDIR /app
COPY . .
RUN chmod +x buildrun.sh
EXPOSE 3000
CMD ["bash", "buildrun.sh"]