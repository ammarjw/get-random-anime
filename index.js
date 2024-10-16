import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const API_URL = process.env.API_URL;

const app = express();

app.use(express.static("public")); // Serve static files

// Helper function to check the word count in a string
function countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Function to fetch a random anime with a synopsis of 20 words or more
async function getAnimeWithSynopsis() {
    let animeData;
    let isValid = false;
    while (!isValid) {
        try {
            const response = await axios.get(API_URL + "/random/anime");
            animeData = response.data.data;
            const synopsis = animeData.synopsis || '';

            // Check if synopsis has at least 40 words
            if (countWords(synopsis) >= 40) {
                isValid = true;
            }
        } catch (error) {
            console.error("Error fetching anime:", error);
            throw new Error("Failed to fetch anime");
        }
    }
    return animeData;
}

app.get("/", async (req, res) => {
    try {
        const anime = await getAnimeWithSynopsis();
        res.render("index.ejs", { anime });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Failed to get anime");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});