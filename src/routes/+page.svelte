<script lang="ts">
  import { getContext } from 'svelte';
  import { resolve, asset } from '$app/paths';
  import { PLANNER, type Planner } from '#lib/planner.svelte.ts';
  import { tripCost, money } from '#lib/domain.ts';
  import Icon from '#lib/components/Icon.svelte';
  const planner = getContext<Planner>(PLANNER);
  const dateRange = (dates: { date: string }[]) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC'
    };
    return `${new Date(dates[0].date + 'T12:00:00Z').toLocaleDateString('en-GB', options)} – ${new Date(dates.at(-1)!.date + 'T12:00:00Z').toLocaleDateString('en-GB', options)}, 2027`;
  };
</script>

<svelte:head
  ><title>My trips · Roam</title><meta
    name="description"
    content="Make room for a little wonder. Roam is a private, local-first demo itinerary planner for your next chapter."
  /></svelte:head
>
<section class="overview page-pad">
  <div class="page-heading">
    <div>
      <p class="eyebrow">LESS SCROLLING. MORE GOING.</p>
      <h1>Make room for<br />a little <em>wonder.</em></h1>
      <p class="lede">Some places stay with you. Let’s get you there.</p>
    </div>
    <div class="heading-note">
      <Icon name="compass" /><span
        >Three little adventures.<br />A world of possibilities.</span
      >
    </div>
  </div>
  <div class="section-title">
    <h2>Your next chapters <span>03</span></h2>
    <span class="quiet">Open a trip. Make it yours.</span>
  </div>
  <div class="trip-grid">
    {#each planner.plans.trips as trip, index (trip.id)}<a
        class:featured={index === 0}
        class="trip-card"
        href={resolve('/trips/[id]', { id: trip.id })}
        ><div class="trip-cover">
          <img
            src={asset(`images/${trip.id}.jpg`)}
            width="1536"
            height="1024"
            alt={trip.id === 'kyoto'
              ? 'Illustrative Kyoto lane with wooden houses and a pagoda'
              : trip.id === 'lisbon'
                ? 'Illustrative Lisbon street with a yellow tram'
                : 'Illustrative Dolomite peaks above a turquoise lake'}
            loading={index ? 'lazy' : 'eager'}
          /><span class="trip-tag">{trip.country} <span>↗</span></span>
        </div>
        <div class="trip-card-body">
          <p class="eyebrow">{trip.days.length} DAYS TO WANDER</p>
          <h3>{trip.title}</h3>
          <p>{trip.intro}</p>
          <div class="trip-card-meta">
            <span><Icon name="calendar" />{dateRange(trip.days)}</span><span
              class="round-arrow"><Icon name="arrow" /></span
            >
          </div>
          <div class="trip-card-footer">
            <span
              >{trip.days.reduce((n, d) => n + d.activities.length, 0)} little plans</span
            ><span>{money(tripCost(trip))} planned</span>
          </div>
        </div></a
      >{/each}
  </div>
  <div class="overview-note">
    <span class="note-symbol">✳</span>
    <div>
      <h2>A plan, with room to breathe.</h2>
      <p>
        Gather your favorite places, shape your days, and leave a little
        unplanned. Your edits stay on this device. Export a copy to take them
        with you.
      </p>
    </div>
    <a href={resolve('/trips/[id]', { id: 'kyoto' })} class="text-link"
      >Find your rhythm <Icon name="arrow" /></a
    >
  </div>
</section>
