<script lang="ts">
  import { getContext } from 'svelte';
  import { PLANNER, type Planner } from '#lib/planner.svelte.ts';
  import Board from '#lib/components/Board.svelte';
  let { data } = $props();
  const planner = getContext<Planner>(PLANNER);
  let trip = $derived(planner.plans.trips.find((t) => t.id === data.id)!);
</script>

<svelte:head
  ><title>{trip.title} · Roam</title><meta
    name="description"
    content={trip.intro}
  /></svelte:head
>
{#key trip.id}<Board {trip} {planner} />{/key}
