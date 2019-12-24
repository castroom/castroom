import express from 'express';
import levelup from 'levelup';
import leveldown from 'leveldown';
import bodyParser from 'body-parser';

// TODO: clear out the old database here
var cache = levelup(leveldown("./cache"))
// var buffer = [];

const app = express();
app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    var key = "test";
    var value = "test_val";

    console.log(req.body);

    // end the connection immediately since we have nothing to send back to the workers
    res.status(200).send(); 

    cache.get(key, (gerr) => {
        if (gerr) {
            // not found in cache
            console.log(gerr);

            cache.put(key, value, (perr) => {
                if (perr) {
                    console.log(perr);
                } else {
                    console.log(key, "was pushed");
                }
            });
        } else {
            // already exists in cache
            console.log(key, "already exists");
        }
    });
    
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});