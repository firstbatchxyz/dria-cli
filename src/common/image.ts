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

/** Checks if an image exists; if not, pulls it from Docker.
 *
 * @param imageName name of the image along with its tag, e.g. `redis:alpine`
 */
export async function pullImageIfNotExists(imageName: string): Promise<void> {
  const exists = await imageExists(imageName);

  if (!exists) {
    logger.info("Pulling", imageName);
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
        function onProgress(event: any) {
          logger.info(event);
        }
      });
    });
    logger.info("Pulled the latest image.");
  }
}
