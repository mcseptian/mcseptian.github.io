import { SvelteComponentTyped } from "svelte";

export interface NotFoundProps {
  link: NotFoundLink;
}

export interface NotFoundLink {
  label: string;
  url: string;
}

export interface NotFoundEvents {
  click: MouseEvent;
  customEvent: CustomEvent<boolean>;
}

export interface NotFoundSlots {
  default: { slotValue: string };
  named: { slotValue: string };
}

export default class NotFound extends SvelteComponentTyped<
  NotFoundProps,
  NotFoundEvents,
  NotFoundSlots
> {}
