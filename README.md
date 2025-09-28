# 📊 Slack Meeting Tracker

A Slack app built with [Bolt for JavaScript](https://slack.dev/bolt-js) that helps teams:
- Start and end meetings with `/meeting-start` and `/meeting-end`
- Track meeting participants
- Calculate meeting duration
- Assign hourly rates per participant with `/set-rate`
- Estimate the cost of each meeting

---

## ⚡ Features
- `/hello` → test the app is running
- `/meeting-start [title]` → start a meeting
- `/meeting-end` → end the meeting, show duration, participants, and cost
- `/set-rate @user 60` → set hourly rate for a user (€/hour)

---

## 📦 Requirements
- Node.js **18+**
- npm or yarn
- [Ngrok](https://ngrok.com/) account (for local dev)
- A Slack workspace where you can install apps

---

## 🚀 Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-org/slack-meeting-tracker.git
cd slack-meeting-tracker
````

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

Create a `.env` file in the project root with:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
PORT=3000
```

👉 You get these from your [Slack App → Basic Information](https://api.slack.com/apps).

### 4. Run ngrok

Expose your local app to Slack:

```bash
ngrok http 3000
```

Copy the forwarding URL (e.g. `https://1234abcd.ngrok-free.app`).

### 5. Configure Slack App

Go to your app’s settings on [api.slack.com/apps](https://api.slack.com/apps) and:

* **Slash Commands**

  * `/hello` → Request URL: `<NGROK_URL>/slack/commands`
  * `/meeting-start` → Request URL: `<NGROK_URL>/slack/commands`
  * `/meeting-end` → Request URL: `<NGROK_URL>/slack/commands`
  * `/set-rate` → Request URL: `<NGROK_URL>/slack/commands`

* **Interactivity & Shortcuts**

  * Turn **On**
  * Request URL: `<NGROK_URL>/slack/events`

* **OAuth & Permissions**

  * Add Bot Token Scopes:

    * `commands`
    * `chat:write`
    * `channels:join`

* Reinstall the app to your workspace.

### 6. Run the app

```bash
npm run dev
```

If everything is correct, you’ll see:

```
⚡️ Meeting Tracker running on 3000
```

---

## 🛠 Example Usage

1. In a Slack channel, invite the bot:

   ```
   /invite @meeting-tracker
   ```

2. Start a meeting:

   ```
   /meeting-start Sprint Planning
   ```

3. End the meeting:

   ```
   /meeting-end
   ```

   → Bot posts duration, participants, and cost.

4. Set user rate:

   ```
   /set-rate @tasos 80
   ```

---

## 📂 Project Structure

```
src/
 ├─ index.ts          # App entrypoint
 ├─ routes/           # Slash command handlers
 ├─ store/            # In-memory stores (meetings, rates)
 ├─ helpers/          # Utility functions
.env                  # Environment variables
```

---

## 👥 Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a PR 🎉

---

## 📝 Notes

* Uses **in-memory storage** → data resets on app restart.
* For production, replace with a database (Redis, Mongo, etc).
* Costs are calculated based on `/set-rate` values (€/hour).
