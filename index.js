require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN);
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

app.use(function (req, res, next) {
  console.log(
    Object.entries(req.body)
      .map((ele, idx) => [(ele[0] += "="), ele[1]])
      .flat()
      .join("&")
  );
  next();
});

app.post("/mild", async (req, res) => {
  console.log(req.body);
  const { token, response_url, channel_id, channel_name, user_id, text } =
    req.body;
  try {
    if (channel_name == "directmessage") {
      const response = await axios.post(`${response_url}`, {
        channel: channel_id,
        replace_original: "true",
        response_type: "in_channel",
        text: `${text} /s`,
      });
    } else {
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
    }

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.json({
      text: `Oops, looks like chef's out for a smoke break. (Don't smoke, kids) Err code: ${error.data.error}`,
    });
  }
});

app.listen(PORT, () =>
  console.log(`Sarcastic Slack is cookin' it up on: ${PORT}`)
);
