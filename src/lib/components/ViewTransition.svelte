<script lang="ts" module>
  import type { Snippet } from "svelte";

  import { onNavigate } from "$app/navigation";

  type Props = {
    children?: Snippet;
    fixedElements?: Snippet;
    fixedElementsPosition?: "beforeContent" | "afterContent";
  };
</script>

<script lang="ts">
  let {
    children,
    fixedElements,
    fixedElementsPosition = "beforeContent",
  }: Props = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) {
      return;
    }

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();

        await navigation.complete;
      });
    });
  });
</script>

{#snippet fixedSnippet()}
  <div class="fixed-elements-wrapper">
    {@render fixedElements?.()}
  </div>
{/snippet}

{#if fixedElements && fixedElementsPosition === "beforeContent"}
  {@render fixedSnippet()}
{/if}

{@render children?.()}

{#if fixedElements && fixedElementsPosition === "afterContent"}
  {@render fixedSnippet()}
{/if}

<style>
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

  .fixed-elements-wrapper {
    view-transition-name: fixed-elements;
  }
</style>
