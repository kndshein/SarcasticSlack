require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Sautéing and Spicin' up Slack messages since 2021",
  });
});

app.post("/mild", (req, res) => {
  res.json({
    status: 200,
    response_type: "in_channel",
    text: "Testing",
  });
});

app.listen(PORT, () =>
  console.log(`Sarcastic Slack is cookin' it up on: ${PORT}`)
);
