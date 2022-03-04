import { SvelteComponentTyped } from "svelte";

export interface CardProps {
  article: Article;
}

export interface Article {
  kind: string;
  id: string;
  blog: {
    id: string;
  };
  published: string;
  updated: string;
  url: string;
  selfLink: string;
  title: string;
  content: string;
  author: Author[];
  replies: {
    totalItems: string;
    selfLink: string;
  };
  labels: string[];
  location: Location;
  etag: string;
}

interface Author {
  id: string;
  displayName: string;
  url: string;
  image: {
    url: string;
  };
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  span: string;
}

export interface CardEvents {
  click: MouseEvent;
  customEvent: CustomEvent<boolean>;
}

export interface CardSlots {
  default: { slotValue: string };
  named: { slotValue: string };
}

export default class Card extends SvelteComponentTyped<
  CardProps,
  CardEvents,
  CardSlots
> {}
