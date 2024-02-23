class DriaClient {
  constructor(readonly url: string) {}

  async health(): Promise<boolean> {
    try {
      const res = await fetch(this.url + "/health");
      return res.ok;
    } catch {
      return false;
    }
  }

  async fetchIds<T>(ids: number[]): Promise<T[]> {
    const res = await fetch(this.url + "/fetch", {
      method: "POST",
      body: JSON.stringify({ id: ids }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.log(res);
      throw `Failed with ${res.status}`;
    }

    const body: { data: T[] } = await res.json();
    return body.data;
  }
}

/**
 * A Dria client to be used with locally hosted HNSW.
 */
export const driaClient = new DriaClient("http://localhost:8080");
