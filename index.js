require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createHmac, timingSafeEqual } = require("crypto");
const querystring = require("querystring");

const app = express();
const bodyParser = require("body-parser");
const web = new WebClient(process.env.BOT_USER_OAUTH_TOKEN);
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Sautéing and Spicin' up Slack messages since 2021",
  });
});

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let encodedReq = querystring.stringify(req.body);
  encodedReq = encodedReq.replace("%20", "+"); //TODO: Replace the brittle workaround here.
  let slackTimestamp = req.headers["x-slack-request-timestamp"];
  let slackSignature = req.headers["x-slack-signature"];
  if (Math.round(Date.now() / 1000) - slackTimestamp > 300) {
    res.json({
      status: 425,
      text: `Oops, looks like chef's out for a smoke break. (Don't smoke, kids) Err code: Too Early or too late`,
    });
    return;
  }
  let baseString = `v0:${slackTimestamp}:${encodedReq}`;
  let signature =
    "v0=" +
    createHmac("sha256", process.env.SIGNING_SECRET)
      .update(baseString)
      .digest("hex");
  if (timingSafeEqual(Buffer.from(slackSignature), Buffer.from(signature))) {
    next();
  } else {
    res.json({
      status: 401,
      text: `Oops, either you're trying to steal the sauce recipe or the dev has botched the code.`,
    });
  }
});

app.post("/mild", async (req, res) => {
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
      status: 500,
      text: `Oops, looks like chef's out for a smoke break. (Don't smoke, kids) Err code: ${error.data.error}`,
    });
  }
});

app.listen(PORT, () =>
  console.log(`Sarcastic Slack is cookin' it up on: ${PORT}`)
);
