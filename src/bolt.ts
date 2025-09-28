import { App } from "@slack/bolt";

export const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  port: Number(process.env.PORT) || 3000,
});
