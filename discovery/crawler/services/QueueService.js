import axios from "axios";

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
        
        axios.post("http://127.0.0.1:8080/submit", {
            test: "testing"
        }).then(response => {
            console.log("Response Code:", response.status);
        }).catch(error => {
            console.log("Error:", error.response.statusText);
        });
        this.clear();
    }
}