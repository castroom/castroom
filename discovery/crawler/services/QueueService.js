export default class QueueService {
  constructor() {
    this.buffer = [];
  }

  push(item) {
    // TODO:
    this.buffer.push(item); 
  }

  clear() {
    this.buffer = [];
  }

  send() {
    console.log("Sending", this.buffer);
    this.clear();
  }
}