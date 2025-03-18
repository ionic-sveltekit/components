<script lang="ts" module>
  import type { Snippet } from "svelte";

  import { createId, sleep } from "briznads-helpers";

  export type Props = {
    trigger?: Snippet;
    children?: Snippet;
    triggerId?: string;
    triggerText?: string;
    triggerIcon?: string;
    triggerIconPosition?: "start" | "end";
    triggerAction?: "hover" | "click" | "context-menu";
    triggerClass?: string;
    renderTriggerButton?: boolean;
    triggerSize?: "small" | "default" | "large";
    triggerColor?:
      | "primary"
      | "secondary"
      | "tertiary"
      | "success"
      | "warning"
      | "danger"
      | "light"
      | "medium"
      | "dark";
    triggerButtonFill?: "default" | "clear" | "outline" | "solid";
    tooltipClass?: string;
    tooltipText?: string;
  };
</script>

<script lang="ts">
  let {
    children,
    trigger,
    triggerId,
    triggerText,
    triggerIcon,
    triggerIconPosition,
    renderTriggerButton = true,
    triggerSize,
    triggerColor,
    triggerButtonFill,
    triggerAction = "hover",
    triggerClass,
    tooltipClass,
    tooltipText,
  }: Props = $props();

  const id = $derived(triggerId ?? createId("html_id"));

  let iconSlot: "icon-only" | "start" | "end" | undefined = $state(undefined);

  $effect(() => {
    if (triggerIcon && renderTriggerButton) {
      iconSlot = triggerText ? triggerIconPosition : "icon-only";
    }
  });

  function onwillPresent(event: CustomEvent): void {
    const target = event.target as HTMLIonPopoverElement;

    if (target?.arrow) {
      assessArrowPosition(target.shadowRoot, target.side);
    }
  }

  async function assessArrowPosition(
    shadowRoot: ShadowRoot | null,
    side: "top" | "bottom" | "left" | "right" | "start" | "end"
  ): Promise<void> {
    const box = shadowRoot?.querySelector(
      ".popover-wrapper .popover-content"
    ) as HTMLElement;

    if (!box) {
      return;
    }

    const radius = window
      .getComputedStyle(box)
      ?.getPropertyValue("border-radius")
      ?.replace("px", "");

    const radiusInt = parseInt(radius, 10);

    if (!radiusInt) {
      return;
    }

    const arrow = shadowRoot?.querySelector(
      ".popover-wrapper .popover-arrow"
    ) as HTMLElement;

    if (!arrow) {
      return;
    }

    // for some reason if I don't insert a pause, the bounding coordinates are not accurate
    await sleep(1);

    const boxRect = box.getBoundingClientRect();
    const arrowRect = arrow.getBoundingClientRect();

    let cornerToFix: string | undefined;

    if (side === "top" || side === "bottom") {
      if (boxRect.left + radiusInt >= arrowRect.left) {
        cornerToFix = `border-${side}-left-radius`;
      } else if (boxRect.right - radiusInt <= arrowRect.right) {
        cornerToFix = `border-${side}-right-radius`;
      }
    } else {
      side = arrowRect.left > boxRect.left ? "left" : "right";

      if (boxRect.top + radiusInt >= arrowRect.top) {
        cornerToFix = `border-top-${side}-radius`;
      } else if (boxRect.bottom - radiusInt <= arrowRect.bottom) {
        cornerToFix = `border-bottom-${side}-radius`;
      }
    }

    // if the arrow is determined to be too close to any side, make that corner square
    if (cornerToFix) {
      box.style.setProperty(cornerToFix, "0");
    }
  }
</script>

{#if (trigger || triggerText || triggerIcon) && (children || tooltipText)}
  {#if trigger && triggerId}
    {@render trigger()}
  {:else if renderTriggerButton}
    <ion-button
      size={triggerSize}
      fill={triggerButtonFill}
      {id}
      color={triggerColor}
      class={triggerClass}
    >
      {#if triggerText}
        {triggerText}
      {/if}

      {#if triggerIcon}
        <ion-icon icon={triggerIcon} slot={iconSlot}></ion-icon>
      {/if}
    </ion-button>
  {:else}
    <span {id} class={triggerClass}
      >{#if triggerIcon && iconSlot !== "end"}<ion-icon
          icon={triggerIcon}
          size={triggerSize}
          color={triggerColor}

        ></ion-icon>{/if}{triggerText}{#if triggerIcon && iconSlot === "end"}<ion-icon
          icon={triggerIcon}
          size={triggerSize}
          color={triggerColor}
        ></ion-icon>{/if}</span
    >
  {/if}

  <ion-popover
    trigger={id}
    trigger-action={triggerAction}
    {onwillPresent}
    class={tooltipClass}
  >
    <aside class="ion-padding">
      {#if children}
        {@render children()}
      {:else}
        {tooltipText}
      {/if}
    </aside>
  </ion-popover>
{/if}

<style></style>
