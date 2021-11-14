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
  res.status(200).send();
  console.log(req.body);
  const { token, channel_id, user_id, text } = req.body;
  try {
    const userInfo = await web.users.info({
      token: process.env.BOT_USER_OAUTH_TOKEN,
      user: user_id,
    });

    await web.chat.postMessage({
      token: process.env.BOT_USER_OAUTH_TOKEN,
      text: `${text} /s`,
      channel: channel_id,
      username: userInfo.user.profile.display_name_normalized,
      icon_url: userInfo.user.profile.image_192,
    });
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () =>
  console.log(`Sarcastic Slack is cookin' it up on: ${PORT}`)
);
