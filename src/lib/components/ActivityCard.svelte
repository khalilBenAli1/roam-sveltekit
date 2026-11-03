<script lang="ts">
  import { money, clock, type Activity, type Day } from '#lib/domain.ts';
  import Icon from './Icon.svelte';
  let {
    activity,
    index,
    total,
    days,
    dayId,
    conflict,
    onedit,
    onremove,
    onreorder,
    onmove
  }: {
    activity: Activity;
    index: number;
    total: number;
    days: Day[];
    dayId: string;
    conflict: boolean;
    onedit: () => void;
    onremove: () => void;
    onreorder: (delta: -1 | 1) => void;
    onmove: (day: string) => void;
  } = $props();
  const icon = { Explore: 'leaf', Food: 'food', Stay: 'bed', Travel: 'train' };
</script>

<li class:has-conflict={conflict} class="activity-row">
  <div class="time-column">
    <strong>{clock(activity.start)}</strong><span
      >{clock(activity.start + activity.duration)}</span
    ><span class="timeline-dot"></span>
  </div>
  <article class="activity" aria-label={activity.title}>
    <div class="activity-content">
      <span class={`category-icon ${activity.category.toLowerCase()}`}
        ><Icon name={icon[activity.category]} /></span
      >
      <div class="activity-copy">
        <div class="activity-category">
          <span>{activity.category}</span><span>•</span><span
            >{activity.duration} min</span
          >
        </div>
        <h3>{activity.title}</h3>
        {#if activity.place}<p class="activity-place">
            <Icon name="pin" />{activity.place}
          </p>{/if}{#if activity.note}<p class="activity-note">
            {activity.note}
          </p>{/if}
      </div>
      <span class="activity-cost"
        >{activity.cents ? money(activity.cents) : 'Free'}</span
      >
    </div>
    {#if conflict}<p class="conflict">
        <Icon name="clock" />Time overlaps another activity. Adjust the time or
        move it.
      </p>{/if}
    <div class="activity-controls">
      <div
        class="reorder-controls"
        aria-label={`Visit order for ${activity.title}`}
      >
        <button
          class="icon-button"
          aria-label={`Move ${activity.title} earlier`}
          disabled={index === 0}
          onclick={() => onreorder(-1)}>↑</button
        ><button
          class="icon-button"
          aria-label={`Move ${activity.title} later`}
          disabled={index === total - 1}
          onclick={() => onreorder(1)}>↓</button
        ><span class="order-number">{index + 1}/{total}</span>
      </div>
      <label class="move-label"
        ><span class="visually-hidden"
          >Move {activity.title} to another day</span
        ><select
          value=""
          onchange={(e) => {
            onmove(e.currentTarget.value);
            e.currentTarget.value = '';
          }}
          ><option value="" disabled>Move to day…</option
          >{#each days as d, i (d.id)}{#if d.id !== dayId}<option
                value={d.id}
                disabled={d.activities.length >= 50}>Day {i + 1}</option
              >{/if}{/each}</select
        ></label
      ><button class="small-button" onclick={onedit}
        ><Icon name="edit" />Edit</button
      ><button
        class="small-button remove-button"
        aria-label={`Remove ${activity.title}`}
        onclick={onremove}>Remove</button
      >
    </div>
  </article>
</li>
