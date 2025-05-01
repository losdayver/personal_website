const socket = new WebSocket("ws://127.0.0.1:3500");

socket.onopen = () => {
  socket.send("Hello World!");

  socket.onmessage = (event) => {
    console.log(event.data);
  };
};
