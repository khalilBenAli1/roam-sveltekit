<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import {
    categories,
    clock,
    toCents,
    toMinutes,
    type Activity
  } from '#lib/domain.ts';
  import Icon from './Icon.svelte';
  let {
    initial,
    onsave,
    onclose
  }: {
    initial?: Activity;
    onsave: (activity: Activity) => void;
    onclose: () => void;
  } = $props();
  let dialog: HTMLDialogElement;
  let title = $state(untrack(() => initial?.title ?? ''));
  let place = $state(untrack(() => initial?.place ?? ''));
  let category = $state(untrack(() => initial?.category ?? 'Explore'));
  let time = $state(untrack(() => clock(initial?.start ?? 600)));
  let duration = $state(untrack(() => initial?.duration ?? 60));
  let cost = $state(untrack(() => ((initial?.cents ?? 0) / 100).toFixed(2)));
  let note = $state(untrack(() => initial?.note ?? ''));
  let error = $state('');
  onMount(() => dialog.showModal());
  function close() {
    dialog.close();
    onclose();
  }
  function save(event: SubmitEvent) {
    event.preventDefault();
    const start = toMinutes(time),
      cents = toCents(cost);
    if (
      !title.trim() ||
      title.length > 100 ||
      !Number.isInteger(start) ||
      start < 0 ||
      start > 1439 ||
      !Number.isInteger(duration) ||
      duration < 5 ||
      duration > 720 ||
      cents === null
    ) {
      error =
        'Add a title, a valid time, a duration of 5–720 minutes, and an estimate up to €99,999.99.';
      return;
    }
    if (start + duration > 1440) {
      error =
        'This activity ends after midnight. Shorten it or choose an earlier time.';
      return;
    }
    dialog.close();
    onsave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      place: place.trim(),
      category,
      start,
      duration,
      cents,
      note: note.trim()
    });
    onclose();
  }
</script>

<dialog
  bind:this={dialog}
  oncancel={(event) => {
    event.preventDefault();
    close();
  }}
  aria-labelledby="editor-title"
>
  <form onsubmit={save}>
    <div class="dialog-header">
      <span class="eyebrow">MAKE A LITTLE PLAN</span><button
        type="button"
        class="icon-button"
        aria-label="Close activity editor"
        onclick={close}><Icon name="close" /></button
      >
    </div>
    <h2 id="editor-title">
      {initial ? 'A change of plans?' : 'What’s on your mind?'}
    </h2>
    <p class="quiet">Small moments make a great day.</p>
    <label
      >Activity name<input
        required
        maxlength="100"
        bind:value={title}
        placeholder="A little detour, perhaps"
      /></label
    ><label
      >Place<input
        maxlength="120"
        bind:value={place}
        placeholder="A neighborhood or a favorite spot"
      /></label
    >
    <div class="form-grid">
      <label
        >Category<select bind:value={category}
          >{#each categories as item (item)}<option>{item}</option
            >{/each}</select
        ></label
      ><label>Start time<input type="time" required bind:value={time} /></label
      ><label
        >Duration (minutes)<input
          type="number"
          min="5"
          max="720"
          step="1"
          required
          bind:value={duration}
        /></label
      ><label
        >Estimate (EUR)<input
          inputmode="decimal"
          required
          pattern={'[0-9]{1,5}(\\.[0-9]{1,2})?'}
          bind:value={cost}
        /></label
      >
    </div>
    <label
      >A note to yourself <span class="quiet">(optional)</span><input
        maxlength="500"
        bind:value={note}
        placeholder="Leave a little reminder"
      /></label
    >
    <p class="form-hint">
      Illustrative estimate for the whole group. No live prices or bookings.
    </p>
    {#if error}<p class="form-error" role="alert">{error}</p>{/if}
    <div class="dialog-actions">
      <button type="button" class="secondary" onclick={close}>Cancel</button
      ><button class="primary" type="submit"
        >{initial ? 'Save changes' : 'Add to my day'}
        <Icon name="plus" /></button
      >
    </div>
  </form>
</dialog>
