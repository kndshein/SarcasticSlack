require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN);
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

app.post("/mild", async (req, res) => {
  console.log(req);
  try {
    await web.chat.postMessage({
      channel: "#sarcasticslack",
      text: `Testing 2`,
    });
    console.log("Message posted!");
    res.json({
      status: 200,
      as_user: true,
      text: "Testing",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(PORT, () =>
  console.log(`Sarcastic Slack is cookin' it up on: ${PORT}`)
);
