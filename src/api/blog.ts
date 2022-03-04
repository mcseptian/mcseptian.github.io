import type { ArticleList } from "../components/Blog/Blog.svelte";

const baseURI =
  "https://www.googleapis.com/blogger/v3/blogs/3668625331368011796/";

/**
 * @param params
 */
export async function getPost(
  params: Record<string, string> | URLSearchParams
): Promise<unknown | ArticleList | Error> {
  const response = await fetch(
    baseURI + "posts?" + new URLSearchParams({ ...params }).toString()
  );
  if (response.ok) {
    const data: unknown | ArticleList = await response.json();
    return Promise.resolve(data);
  } else {
    return Promise.reject(new Error("no post found"));
  }
}
