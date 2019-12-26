import axios from "axios";

export default class QueueService {
  constructor() {
    this.buffer = [];
  }

  push(item) {
    this.buffer.push(item);
  }

  clear() {
    this.buffer = [];
  }

  send() {
    // sends the buffered messages to the master node
    console.log("Sending", this.buffer);
    axios.post("http://127.0.0.1:8080/push", {
      urls: this.buffer,
    }).then((response) => {
      console.log("Response Code:", response.status);
    }).catch((error) => {
      console.log("Error:", error.response.statusText);
    });
    this.clear();
  }
}
