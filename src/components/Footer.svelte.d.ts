import { SvelteComponentTyped } from "svelte";

export interface SocialIcons {
  kind: string;
  url: string;
  title: string;
  content: string;
}

export interface FooterEvents {
  click: MouseEvent;
  customEvent: CustomEvent<boolean>;
}

export interface FooterSlots {
  default: { slotValue: string };
  named: { slotValue: string };
}

export default class Footer extends SvelteComponentTyped<
  Article,
  FooterEvents,
  FooterSlots
> {}
