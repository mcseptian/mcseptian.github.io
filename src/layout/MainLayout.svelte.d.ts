import { SvelteComponentTyped } from "svelte";
import { RouteProps } from "svelte-router-spa/types/components/route";
import type { SocialIcons } from "../components/Footer";

export interface MainLayoutProps extends RouteProps {
  socialIcons: SocialIcons;
}

export interface MainLayoutEvents {
  click: MouseEvent;
  customEvent: CustomEvent<boolean>;
}

export interface MainLayoutSlots {
  default: { slotValue: string };
  named: { slotValue: string };
}

export default class MainLayout extends SvelteComponentTyped<
  MainLayoutProps,
  MainLayoutEvents,
  MainLayoutSlots
> {}
