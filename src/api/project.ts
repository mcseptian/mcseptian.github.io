const baseURI = "https://api.github.com/users/mcseptian/";

/**
 * @param endpoint
 * @param params
 */
export async function getProject(
  endpoint: string,
  params: Record<string, string> | URLSearchParams
): Promise<unknown | Error> {
  const response = await fetch(
    baseURI + endpoint + "?" + new URLSearchParams({ ...params }).toString()
  );
  if (response.ok) {
    const data: unknown | Record<string, string | number | null> =
      await response.json();
    return Promise.resolve(data);
  } else {
    return Promise.reject(new Error("no post found"));
  }
}
