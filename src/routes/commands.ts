import { boltApp } from "../bolt";
import { memoryStore } from "../store/memoryStore";
import { ratesStore } from "../store/ratesStore";

boltApp.command("/hello", async ({ command, ack, respond }) => {
  await ack();
  await respond(`👋 Hello <@${command.user_id}>!`);
});

boltApp.command("/meeting-start", async ({ command, ack, client }) => {
  await ack();
  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: "modal",
      callback_id: "meeting_start_modal",
      title: { type: "plain_text", text: "Start meeting" },
      submit: { type: "plain_text", text: "Start" },
      close: { type: "plain_text", text: "Cancel" },
      private_metadata: JSON.stringify({ channel_id: command.channel_id }),
      blocks: [
        {
          type: "input",
          block_id: "title_block",
          label: { type: "plain_text", text: "Title" },
          element: {
            type: "plain_text_input",
            action_id: "title_input",
            placeholder: { type: "plain_text", text: "e.g. Sprint Planning" },
          },
        },
        {
          type: "input",
          block_id: "users_block",
          label: { type: "plain_text", text: "Participants" },
          element: {
            type: "multi_users_select",
            action_id: "users_select",
            placeholder: { type: "plain_text", text: "Select users" },
          },
        },
      ],
    },
  });
});

boltApp.view("meeting_start_modal", async ({ ack, view, client }) => {
  await ack();
  const meta = JSON.parse(view.private_metadata || "{}");
  const channel: string = meta.channel_id;
  const title =
    view.state.values["title_block"]["title_input"].value?.trim() ||
    "Untitled meeting";
  const participants: string[] =
    view.state.values["users_block"]["users_select"].selected_users || [];

  memoryStore.set(channel, { title, participants, startTs: Date.now() });

  await client.chat.postMessage({
    channel,
    text: `▶️ *Started:* ${title}\n👥 ${
      participants.length ? participants.map((u) => `<@${u}>`).join(", ") : "—"
    }`,
  });
});

boltApp.command("/meeting-end", async ({ command, ack, client }) => {
  await ack();

  const channel = command.channel_id;
  const meeting = memoryStore.end(channel);

  if (!meeting) {
    await client.chat.postMessage({
      channel,
      text: "ℹ️ No active meeting here. Use /meeting-start first.",
    });
    return;
  }

  const durationSec = Math.max(
    1,
    Math.round((Date.now() - meeting.startTs) / 1000)
  );
  const durationMin = Math.ceil(durationSec / 60);
  const durationHours = durationSec / 3600;

  // Υπολογισμός κόστους
  let total = 0;
  const perUserLines: string[] = [];

  for (const userId of meeting.participants) {
    const rate = ratesStore.getRate(userId); // €/hour
    const cost = rate * durationHours; // € για αυτό το meeting
    total += cost;
    perUserLines.push(`• <@${userId}>: €${cost.toFixed(2)} (${rate}/h)`);
  }

  await client.chat.postMessage({
    channel,
    text: [
      `⏹️ *Ended:* ${meeting.title}`,
      `⏱️ *Duration:* ${durationMin} min`,
      `👥 *Participants:* ${
        meeting.participants.length
          ? meeting.participants.map((u) => `<@${u}>`).join(", ")
          : "—"
      }`,
      `💰 *Total cost:* €${total.toFixed(2)}`,
      perUserLines.length ? perUserLines.join("\n") : "—",
    ].join("\n"),
  });
});

boltApp.command("/set-rate", async ({ command, ack, respond }) => {
  await ack();
  const [mention, rateStr] = command.text.trim().split(/\s+/);

  if (!mention || !rateStr) {
    await respond("Usage: `/set-rate @user 60`");
    return;
  }

  const userId = mention.replace(/[<@>]/g, "");
  const rate = parseFloat(rateStr);

  if (isNaN(rate)) {
    await respond("Please provide a valid number for rate.");
    return;
  }

  ratesStore.setRate(userId, rate);
  await respond(`✅ Set rate for <@${userId}> = €${rate}/hour`);
});
