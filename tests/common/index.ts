export class DriaClient {
  constructor(readonly url: string) {}

  async health(): Promise<boolean> {
    const res = await fetch(this.url + "/health", {
      method: "GET",
    });
    console.log(res);
    return true;
  }

  async fetchIds(ids: number[]): Promise<unknown> {
    return true;
  }
}
