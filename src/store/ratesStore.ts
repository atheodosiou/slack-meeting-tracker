type UserId = string;

class RatesStore {
  private rates = new Map<UserId, number>();

  setRate(user: UserId, rate: number) {
    this.rates.set(user, rate);
  }

  getRate(user: UserId): number {
    return this.rates.get(user) ?? 50; // default 50€/hour
  }
}

export const ratesStore = new RatesStore();
