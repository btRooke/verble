const express = require("express");
const axios = require("axios");
const cors = require("cors");

const PORT = 3000;

if (process.argv.length != 3) {
    console.log(`Expected 1 command line argument, got ${process.argv.length - 2}`);
    console.log("Usage: node server.js <API Key>");
    process.exit(1);
}

const TOKEN = process.argv[2];

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