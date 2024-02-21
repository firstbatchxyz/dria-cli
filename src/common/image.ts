import { docker, logger } from ".";

/** Returns the first image ID with the given image if it exists, otherwise `null`.
 *
 * @param imageName name of the image along with its tag, e.g. `redis:alpine`
 * @returns a boolean indicating that the image exists
 * @example
 * await imageExists("redis:alpine"); // true
 * await imageExists("idontexist:atall"); // false
 */
export async function imageExists(imageName: string): Promise<boolean> {
  const images = await docker.listImages({
    all: true,
    filters: JSON.stringify({
      reference: [imageName],
    }),
  });

  return images.length !== 0;
}

/**
 * Pulls the latest image.
 *
 * We always need to pull because if both our local image & Docker Hub image has the tag `:latest` we have no easy
 * way to know whether the sha256's are the same. Pulling every time is fine because:
 *
 * - If local image does not exist, you will pull the latest one
 * - If local image is outdated, you will pull the latest one
 * - If local image is up-to-date, you will not pull it again (the digest check happens in the background)
 *
 * @param imageName name of the image along with its tag, e.g. `redis:alpine`
 */
export async function pullImage(imageName: string): Promise<void> {
  await new Promise((resolve, reject) => {
    docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
      if (err) reject(err);

      docker.modem.followProgress(stream, onFinished, onProgress);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function onFinished(err: Error | null, output: unknown) {
        //output is an array with output json parsed objects
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      function onProgress(event: PullProgress) {
        if (event.status == "Downloading" || event.status == "Extracting") {
          logger.info(`${event.status} ${event.id}: ${event.progress}`);
        } else if (event.status.startsWith("Status: Downloaded newer image"))
          logger.info("Image", imageName, "updated.");
      }
    });
  });
}

type PullProgress =
  | {
      status:
        | `Digest: sha256:${string}`
        | `Status: Downloaded newer image for ${string}`
        | `Status: Image is up to date for ${string}`;
    }
  | {
      status: `Pulling from ${string}`;
      id: string;
    }
  | {
      status: "Already exists" | "Pull complete" | "Verifying Checksum" | "Download complete";
      progressDetail: Record<string, never>; // empty object
      id: string;
    }
  | {
      status: "Downloading" | "Extracting";
      progressDetail: { current: number; total: number };
      progress: string; // something like [===>    ] cur/total
      id: string;
    };
