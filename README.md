# @ionic-sveltekit/components

A collection of reusable components for Ionic SvelteKit projects.

## Overview

This package provides a set of ready-to-use components that integrate Ionic UI elements with SvelteKit routing and capabilities. It's designed to simplify the development of Ionic applications built with SvelteKit by providing common UI patterns and functionality.

## Installation

```bash
npm install @ionic-sveltekit/components
```

This package requires `@ionic-sveltekit/core` as a peer dependency.

## Components

### Tabs

The `Tabs` component combines SvelteKit routing with Ionic's tab UI layout. It handles navigation between tabs and preserves the tab UI state.

```svelte
<script>
  import { Tabs } from '@ionic-sveltekit/components';
  
  const tabs = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/',
    },
    {
      title: 'Profile',
      icon: 'person-outline',
      link: '/profile',
      activeOnDescendent: true,
    }
  ];
</script>

<Tabs {tabs}>
  {#snippet content()}
    <slot />
  {/snippet}
</Tabs>
```

#### Props

```typescript
type Props = {
  content: Snippet;                       // Svelte snippet for tab content
  tabs: Tab[];                           // Array of tab configurations
  tabPosition?: "top" | "bottom";        // Position of tabs (default: "bottom")
  viewTransition?: boolean;              // Enable view transitions (default: true)
  fixedElements?: Snippet;               // Elements to render behind the tab bar
};

// Tab definition
type BaseTab = {
  link: string;                          // Route path for the tab
  activeOnDescendent?: boolean;          // Whether tab is active on child routes
  matchPath?: RegExp;                    // Custom RegExp for route matching
};

// A tab must have either title, icon, or both
type Tab = (
  | { title?: string; icon: string }     // Icon-only or icon with title
  | { title: string; icon?: string }     // Title-only or title with icon
) & BaseTab;
```

### Tooltip

Display additional information in a popover when hovering or clicking on an element.

```svelte
<script>
  import { Tooltip } from '@ionic-sveltekit/components';
</script>

<Tooltip
  triggerText="Hover me"
  tooltipText="Here's some additional info!"
/>
```

#### Props

```typescript
type Props = {
  trigger?: Snippet;                     // Custom trigger element
  children?: Snippet;                    // Custom tooltip content
  triggerId?: string;                    // ID for trigger element
  triggerText?: string;                  // Text for trigger
  triggerIcon?: string;                  // Icon for trigger
  triggerIconPosition?: "start" | "end"; // Icon position when with text
  triggerAction?: "hover" | "click" | "context-menu"; // Action to show tooltip
  triggerClass?: string;                 // CSS class for trigger
  renderTriggerButton?: boolean;         // Render as button (default: true)
  triggerSize?: "small" | "default" | "large"; // Size of trigger
  triggerColor?: "primary" | "secondary" | "tertiary" | "success" | 
    "warning" | "danger" | "light" | "medium" | "dark"; // Trigger color
  triggerButtonFill?: "default" | "clear" | "outline" | "solid"; // Button style
  tooltipClass?: string;                 // CSS class for tooltip
  tooltipText?: string;                  // Simple text for tooltip
};
```

### Ago

A component that displays a relative time string (e.g., "2 hours ago").

```svelte
<script>
  import { Ago } from '@ionic-sveltekit/components';
</script>

<Ago from={new Date(2023, 0, 1)} />
```

#### Props

```typescript
type Props = {
  from: Date | string | number;  // The date to calculate elapsed time from
  now?: Date | string | number;  // Reference date (defaults to current time)
};
```

### ViewTransition

A component that enables smooth transitions between pages.

```svelte
<script>
  import { ViewTransition } from '@ionic-sveltekit/components';
</script>

<ViewTransition>
  {#snippet children()}
    <slot />
  {/snippet}
</ViewTransition>
```

#### Props

```typescript
type Props = {
  children?: Snippet;                       // Main content
  fixedElements?: Snippet;                  // Elements that remain fixed during transition
  fixedElementsPosition?: "beforeContent" | "afterContent"; // Position of fixed elements
};
```

## Utilities

### Helper Functions

- `handleEnterKey`: Function to handle Enter key press events
- `preventDefault`: Function to prevent default event behavior

```svelte
<script>
  import { handleEnterKey, preventDefault } from '@ionic-sveltekit/components';
</script>

<button onkeydown={handleEnterKey(preventDefault(() => alert('Enter pressed!')))}>
  Press Enter
</button>
```

## Future Plans

Future development will include additional desktop page layout modules and more advanced components to enhance your Ionic SvelteKit applications.

## Requirements

- SvelteKit 2.0 or higher
- @ionic-sveltekit/core
- Svelte 5.0 or higher

## License

[MIT](LICENSE)
