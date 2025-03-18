<script lang="ts" module>
  import type { Snippet } from "svelte";

  import { onNavigate, goto } from "$app/navigation";

  import { page } from "$app/state";

  import { handleEnterKey, preventDefault } from "$utilities/helper";

  type BaseTab = {
    link: string;
    activeOnDescendent?: boolean;
    matchPath?: RegExp;
  };

  interface TabOptionalTitle extends BaseTab {
    title?: string;
    icon: string;
  }

  interface TabOptionalIcon extends BaseTab {
    title: string;
    icon?: string;
  }

  export type Tab = TabOptionalTitle | TabOptionalIcon;

  export type Props = {
    content: Snippet;
    tabs: Tab[];
    tabPosition?: "top" | "bottom";
    viewTransition?: boolean;
    fixedElements?: Snippet;
  };
</script>

<script lang="ts">
  let {
    content,
    tabs,
    tabPosition,
    viewTransition = true,
    fixedElements,
  }: Props = $props();

  onNavigate((navigation) => {
    if (!(viewTransition && document.startViewTransition)) {
      return;
    }

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();

        await navigation.complete;
      });
    });
  });

  function isSelected(tab: Tab, pathname: string): boolean {
    if (tab.matchPath) {
      return tab.matchPath.test(pathname);
    }

    return tab.activeOnDescendent === true
      ? pathname.startsWith(tab.link)
      : tab.link === pathname;
  }
</script>

<ion-tabs>
  <ion-content>
    <main class="tab-content">
      {@render content()}
    </main>
  </ion-content>

  <ion-tab-bar slot={tabPosition ?? "bottom"}>
    {#each tabs as tab}
      <ion-tab-button
        selected={isSelected(tab, page.url.pathname)}
        onclick={preventDefault(() => goto(tab.link))}
        onkeydown={handleEnterKey(preventDefault(() => goto(tab.link)))}
        role="tab"
        tabindex="0"
      >
        {#if tab.icon}
          <ion-icon icon={tab.icon}></ion-icon>
        {/if}

        {#if tab.title}
          {tab.title}
        {/if}
      </ion-tab-button>
    {/each}
  </ion-tab-bar>

  <!--
    Any elements placed here, within ion-tabs after ion-tab-bar, will be rendered behind the tab bar.
    Custom CSS should be used to position these elements.
  -->
  {#if fixedElements}
    {@render fixedElements()}
  {/if}
</ion-tabs>

<style>
  .tab-content {
    max-width: 100vw;
    justify-self: center;
  }

  @media (min-width: 600px) {
    .tab-content {
      max-width: 580px;
    }
  }

  ion-tab-bar {
    view-transition-name: tab-bar;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(30px);
    }
  }

  @keyframes slide-to-left {
    to {
      transform: translateX(-30px);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    :root::view-transition-old(root) {
      animation:
        90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    :root::view-transition-new(root) {
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
    }
  }
</style>
