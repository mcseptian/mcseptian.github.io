import { SvelteComponentTyped } from "svelte";
import type { Article } from "../Card/Card.svelte";

export interface ArticleList {
  kind: string;
  nextPageToken: string;
  items: Article[];
  etag: string;
}

export interface BlogEvents {
  click: MouseEvent;
  customEvent: CustomEvent<boolean>;
}

export interface BlogSlots {
  default: { slotValue: string };
  named: { slotValue: string };
}

export default class Blog extends SvelteComponentTyped<BlogEvents, BlogSlots> {}
