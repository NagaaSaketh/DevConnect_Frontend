import io from "socket.io-client";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io("http://localhost:4000");
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
