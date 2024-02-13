import { docker } from ".";

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
