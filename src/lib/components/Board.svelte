<script lang="ts">
  import { resolve, asset } from '$app/paths';
  import { untrack } from 'svelte';
  import type { Planner } from '#lib/planner.svelte.ts';
  import {
    categories,
    conflicts,
    summary,
    money,
    tripCost,
    clock,
    reorder,
    move,
    type Activity,
    type Trip,
    type Category
  } from '#lib/domain.ts';
  import Icon from './Icon.svelte';
  import Editor from './Editor.svelte';
  import ActivityCard from './ActivityCard.svelte';
  let { trip, planner }: { trip: Trip; planner: Planner } = $props();
  let selected = $state(untrack(() => trip.days[0].id));
  let filter = $state<Category | 'All'>('All');
  let editing = $state(false);
  let initial = $state<Activity | undefined>();
  let tab = $state<'itinerary' | 'saved'>('itinerary');
  let day = $derived(trip.days.find((d) => d.id === selected) ?? trip.days[0]);
  let dayIndex = $derived(trip.days.findIndex((d) => d.id === day.id));
  let totals = $derived(summary(day.activities));
  let overlaps = $derived(conflicts(day.activities));
  let cost = $derived(tripCost(trip));
  let remaining = $derived(trip.budgetCents - cost);
  let visible = $derived(
    day.activities.filter((a) => filter === 'All' || a.category === filter)
  );
  const dateLabel = (date: string, weekday = false) =>
    new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', {
      ...(weekday ? { weekday: 'long' } : {}),
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC'
    });
  function update(activities: Activity[], message: string) {
    planner.update(
      {
        ...trip,
        days: trip.days.map((d) => (d.id === day.id ? { ...d, activities } : d))
      },
      message
    );
  }
  function save(activity: Activity) {
    update(
      initial
        ? day.activities.map((a) => (a.id === initial?.id ? activity : a))
        : [...day.activities, activity],
      initial ? 'Activity updated.' : 'A new little plan added to your day.'
    );
    filter = 'All';
  }
  function changeOrder(id: string, delta: -1 | 1) {
    const next = reorder(day, id, delta);
    update(
      next.activities,
      'Visit order updated. Start times stay as planned.'
    );
  }
  function moveTo(id: string, target: string) {
    const targetIndex = trip.days.findIndex((d) => d.id === target);
    planner.update(
      move(trip, day.id, target, id),
      `Activity moved to day ${targetIndex + 1}. Times and budgets updated.`
    );
  }
  function addSaved(activity: Activity) {
    if (day.activities.length >= 50) {
      planner.status =
        'This day has 50 activities. Choose another day or remove an activity first.';
      return;
    }
    update(
      [...day.activities, { ...activity, id: crypto.randomUUID() }],
      `${activity.title} added to day ${dayIndex + 1}.`
    );
    filter = 'All';
    tab = 'itinerary';
  }
</script>

<section class="trip-page">
  <div class="trip-hero">
    <img
      src={asset(`images/${trip.id}.jpg`)}
      srcset={`${asset(`images/${trip.id}-900.jpg`)} 900w, ${asset(`images/${trip.id}.jpg`)} 1536w`}
      sizes="(max-width: 820px) 100vw, calc(100vw - 218px)"
      alt={trip.id === 'kyoto'
        ? 'Illustrative Kyoto old town at dawn'
        : trip.id === 'lisbon'
          ? 'Illustrative golden Lisbon street'
          : 'Illustrative Dolomite mountain landscape'}
      width="1536"
      height="1024"
    />
    <div class="hero-shade"></div>
    <a href={resolve('/')} class="back-link">← All trips</a><span
      class="hero-label">{trip.country} · A LITTLE ADVENTURE</span
    >
    <div class="hero-copy">
      <h1>{trip.title}</h1>
      <p>{trip.intro}</p>
    </div>
    <span class="image-caption">Illustrative destination artwork</span>
  </div>
  <div class="trip-meta">
    <span
      ><Icon name="calendar" />{dateLabel(trip.days[0].date)} – {dateLabel(
        trip.days.at(-1)!.date
      )}
      {new Date(trip.days.at(-1)!.date + 'T12:00:00Z').getUTCFullYear()}</span
    ><span><Icon name="people" />{trip.travelers} travelers</span><span
      ><Icon name="trips" />{trip.days.length} days, your way</span
    ><span class="saved-indicator"
      ><Icon name="check" />{!planner.loaded
        ? 'Opening local plans…'
        : planner.state === 'ready'
          ? 'Saved on this device'
          : 'For this visit only'}</span
    >
  </div>
  <div class="trip-tabs" aria-label="Trip sections">
    <button
      class:chosen={tab === 'itinerary'}
      onclick={() => (tab = 'itinerary')}
      aria-pressed={tab === 'itinerary'}
      ><Icon name="calendar" />Itinerary</button
    ><button
      class:chosen={tab === 'saved'}
      onclick={() => (tab = 'saved')}
      aria-pressed={tab === 'saved'}
      ><Icon name="heart" />Saved places
      <span>{trip.saved.length}</span></button
    ><span class="quiet">A little structure. A lot of possibility.</span>
  </div>
  <div class="planner-layout">
    <nav class="day-rail" aria-label="Trip days">
      <p class="eyebrow">THE LITTLE JOURNEY</p>
      {#each trip.days as item, index (item.id)}<button
          class:selected={day.id === item.id}
          aria-current={day.id === item.id ? 'date' : undefined}
          onclick={() => {
            selected = item.id;
            filter = 'All';
          }}
          ><span class="day-number">{String(index + 1).padStart(2, '0')}</span
          ><span
            ><strong>Day {index + 1}</strong><small
              >{dateLabel(item.date)}</small
            ></span
          ><span class="day-count">{item.activities.length}</span></button
        >{/each}
      <div class="day-rail-note">
        <span>↝</span>
        <p>The best moments<br />aren’t always planned.</p>
      </div>
    </nav>
    <div class="day-board">
      <div class="day-heading">
        <div>
          <p class="eyebrow">
            DAY {String(dayIndex + 1).padStart(2, '0')}
            <span> / {dateLabel(day.date, true)}</span>
          </p>
          <h2>{tab === 'saved' ? 'A few places for later' : day.title}</h2>
          <p class="quiet">
            {tab === 'saved'
              ? `A little inspiration for day ${dayIndex + 1}. Add a place when the moment feels right.`
              : 'A good day starts with a little possibility.'}
          </p>
        </div>
        {#if tab === 'itinerary'}<button
            class="primary"
            disabled={day.activities.length >= 50}
            onclick={() => {
              initial = undefined;
              editing = true;
            }}><Icon name="plus" />Add activity</button
          >{/if}
      </div>
      {#if tab === 'itinerary'}<div
          class="filters"
          aria-label="Filter activities"
        >
          {#each ['All', ...categories] as category (category)}<button
              class:selected={filter === category}
              aria-pressed={filter === category}
              onclick={() => {
                if (
                  category === 'All' ||
                  categories.some((c) => c === category)
                )
                  filter = category as Category | 'All';
              }}
              >{category}{#if category === 'All'}<span
                  >{day.activities.length}</span
                >{/if}</button
            >{/each}
        </div>
        {#if visible.length}<ol class="timeline">
            {#each visible as activity (activity.id)}<ActivityCard
                {activity}
                index={day.activities.findIndex((a) => a.id === activity.id)}
                total={day.activities.length}
                days={trip.days}
                dayId={day.id}
                conflict={overlaps.has(activity.id)}
                onedit={() => {
                  initial = activity;
                  editing = true;
                }}
                onremove={() =>
                  update(
                    day.activities.filter((a) => a.id !== activity.id),
                    `${activity.title} removed. You can undo this.`
                  )}
                onreorder={(delta) => changeOrder(activity.id, delta)}
                onmove={(target) => moveTo(activity.id, target)}
              />{/each}
          </ol>
          <p class="timeline-hint">
            <Icon name="clock" />Visit order is flexible. Arrow controls reorder
            stops; start times stay fixed.
          </p>{:else}<div class="empty-day">
            <span class="empty-illustration"><Icon name="sun" /></span>
            <p class="eyebrow">A LOVELY BLANK PAGE</p>
            <h3>
              {filter === 'All'
                ? 'Leave room for a little wonder.'
                : `No ${filter.toLowerCase()} plans yet.`}
            </h3>
            <p>
              {filter === 'All'
                ? 'A slow morning? A favorite café? Start with one small thing, or borrow an idea from your saved places.'
                : 'Try another category or add a new activity to this day.'}
            </p>
            <div>
              {#if filter !== 'All'}<button
                  class="secondary"
                  onclick={() => (filter = 'All')}>Show all activities</button
                >{/if}<button class="secondary" onclick={() => (tab = 'saved')}
                ><Icon name="heart" />Explore saved places</button
              >
            </div>
          </div>{/if}
      {:else}<div class="saved-grid">
          {#each trip.saved as place (place.id)}<article class="saved-place">
              <span class="saved-category"
                ><Icon
                  name={place.category === 'Food' ? 'food' : 'leaf'}
                />{place.category}</span
              >
              <h3>{place.title}</h3>
              <p><Icon name="pin" />{place.place}</p>
              <div>
                <span
                  >{place.duration} min · {place.cents
                    ? money(place.cents)
                    : 'Free'}</span
                ><button class="small-button" onclick={() => addSaved(place)}
                  ><Icon name="plus" />Add to day {dayIndex + 1}</button
                >
              </div>
            </article>{/each}
        </div>{/if}
    </div>
    <aside class="trip-summary" aria-label="Plan summary">
      <div class="summary-heading">
        <Icon name="sun" /><span>THE DAY AT A GLANCE</span>
      </div>
      <h3>Time well spent.</h3>
      <dl>
        <div>
          <dt>Little plans</dt>
          <dd>{day.activities.length}</dd>
        </div>
        <div>
          <dt>Activity time</dt>
          <dd>{Math.floor(totals.minutes / 60)}h {totals.minutes % 60}m</dd>
        </div>
        <div>
          <dt>Last stop ends</dt>
          <dd>{totals.end === null ? 'Wide open' : clock(totals.end)}</dd>
        </div>
        <div>
          <dt>Day estimate</dt>
          <dd>{money(totals.cents)}</dd>
        </div>
      </dl>
      {#if overlaps.size}<p class="summary-conflict">
          {overlaps.size} activities have overlapping times.
        </p>{/if}
      <div class="budget-summary">
        <span class="eyebrow">THE WHOLE ADVENTURE</span>
        <p>
          <strong>{money(cost)}</strong><span>
            / {money(trip.budgetCents)}</span
          >
        </p>
        <div
          class="budget-track"
          role="meter"
          aria-label="Trip budget used"
          aria-valuemin="0"
          aria-valuemax={trip.budgetCents}
          aria-valuenow={Math.min(cost, trip.budgetCents)}
        >
          <span
            style={`width:${Math.min(100, (cost / trip.budgetCents) * 100)}%`}
          ></span>
        </div>
        <p class:over-budget={remaining < 0} class="budget-remaining">
          {money(Math.abs(remaining))}
          {remaining < 0
            ? 'over your sample budget'
            : 'room for something lovely'}
        </p>
      </div>
      <p class="summary-footnote">
        Illustrative EUR estimates for the whole group. Travel between stops is
        not calculated. No live availability or navigation.
      </p>
    </aside>
  </div>
</section>
{#if editing}<Editor
    {initial}
    onsave={save}
    onclose={() => (editing = false)}
  />{/if}
