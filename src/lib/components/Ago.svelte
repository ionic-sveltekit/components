<script lang="ts" module>
	import { parseDate, lapsed, getDateString } from 'briznads-helpers';


	export type Props = {
    from : Date | string | number;
		now? : Date | string | number;
  };
</script>

<script lang="ts">
	let { from, now }: Props = $props();

	let parseLapsed : string | undefined = $state(undefined);

	let fromObj : Date = $derived(parseDate(from));
	let nowObj : Date = $derived(now ? parseDate(now) : new Date());

	$effect(() => {
		if (fromObj && fromObj.toString() !== 'Invalid Date' && nowObj && nowObj.toString() !== 'Invalid Date') {
			parseLapsed = lapsed(nowObj.getTime() - fromObj.getTime());
		}
	});
</script>


<style></style>


<span title={ getDateString(fromObj) }>{ parseLapsed ? parseLapsed + ' ago' : 'never' }</span>
