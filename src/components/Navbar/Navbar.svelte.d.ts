import { SvelteComponentTyped } from "svelte";

export interface NavbarProps {
  name: string;
}

export interface SocialIcons {
  kind: string;
  url: string;
  title: string;
  content: string;
}

export interface NavbarEvents {
  click: MouseEvent;
  customEvent: CustomEvent<boolean>;
}

export interface NavbarSlots {
  default: { slotValue: string };
  named: { slotValue: string };
}

export default class Navbar extends SvelteComponentTyped<
  NavbarProps,
  NavbarEvents,
  NavbarSlots
> {}
