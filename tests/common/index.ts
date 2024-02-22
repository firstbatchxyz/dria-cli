export class DriaClient {
  constructor(readonly url: string) {}

  async health(): Promise<boolean> {
    return true;
  }

  async fetch(ids: number[]): Promise<unknown> {
    return true;
  }
}
