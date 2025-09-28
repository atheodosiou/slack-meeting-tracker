export type ChannelId = string;
export type UserId = string;

export interface ActiveMeeting {
  title: string;
  participants: UserId[];
  startTs: number; // ms epoch
}

class MemoryStore {
  private meetings = new Map<ChannelId, ActiveMeeting>();
  get = (ch: ChannelId) => this.meetings.get(ch);
  set = (ch: ChannelId, m: ActiveMeeting) => this.meetings.set(ch, m);
  end(ch: ChannelId) {
    const m = this.meetings.get(ch);
    if (m) this.meetings.delete(ch);
    return m;
  }
  has = (ch: ChannelId) => this.meetings.has(ch);
}
export const memoryStore = new MemoryStore();
