const express = require("express");
const axios = require("axios");
const cors = require("cors");

if (process.argv.length < 3 && !process.env?.API_KEY) {
    console.log(`Expected API key in command line argument or environment var API_KEY`);
    process.exit(1);
}

let TOKEN = process.env?.API_KEY ?? process.argv[2];
let PORT = process.env?.PORT ?? 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/token", async (req, res) => {
    try {
        const response = await axios.post("https://api.assemblyai.com/v2/realtime/token",
            { expires_in: 3600 },
            { headers: { Authorization: TOKEN } }
        );
    
        const { data } = response;
        res.json(data);
    } 
  
    catch (error) {
        const { response: {status, data} } = error;
        res.status(status).json(data);
    }
});

app.use(express.static("build"))

const server = app.listen(PORT, () => {
    console.log(`Started token server on port ${PORT}...`);
});