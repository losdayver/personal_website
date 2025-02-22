import { WebSocketServer } from "ws";
import { config } from "../../config/app.config";

const sockserver = new WebSocketServer({ port: config.socketPort });

export const initSockets = () => {
  sockserver.on("connection", (clientSocket) => {
    clientSocket.send("connection established!");

    clientSocket.on("message", (data: Buffer) => {
      console.log(data.toString());
    });
  });
};
