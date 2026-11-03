<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { Planner, PLANNER } from '#lib/planner.svelte.ts';
  import Icon from '#lib/components/Icon.svelte';
  import '../app.css';
  let { children } = $props();
  const planner = new Planner();
  setContext(PLANNER, planner);
  let resetDialog: HTMLDialogElement;
  let resetTrigger: HTMLButtonElement | undefined;
  function openReset(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLButtonElement)
      resetTrigger = event.currentTarget;
    resetDialog.showModal();
  }
  function closeReset() {
    resetDialog.close();
    resetTrigger?.focus();
  }
  let importInput: HTMLInputElement;
  let importError = $state('');
  onMount(() => planner.load());
  function exportPlans() {
    const blob = new Blob([JSON.stringify(planner.plans, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'roam-plans.json';
    anchor.click();
    URL.revokeObjectURL(url);
    planner.status = 'Plans exported. Keep this file as your backup.';
  }
  async function importPlans(event: Event) {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    const file = input.files?.[0];
    if (!file) return;
    importError = '';
    try {
      if (file.size > 300000)
        throw Error('This file exceeds the 300 KB limit.');
      planner.import(await file.text());
    } catch (error) {
      importError =
        error instanceof Error ? error.message : 'This file could not be read.';
    }
    input.value = '';
  }
</script>

<svelte:head>
  <meta property="og:site_name" content="Roam" />
  <meta property="og:type" content="website" />
  <meta
    property="og:image"
    content="https://khalilbenali1.github.io/roam-sveltekit/images/kyoto-900.jpg"
  />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
<a class="skip" href="#main">Skip to content</a>
<div class="app-shell">
  <aside class="sidebar" aria-label="Roam navigation">
    <a class="brand" href={resolve('/')} aria-label="Roam home"
      ><span class="brand-icon"><Icon /></span>roam<span class="brand-dot"
        >.</span
      ></a
    >
    <p class="sidebar-kicker">A LITTLE FURTHER</p>
    <nav aria-label="Main">
      <a class:active={page.route.id === '/'} href={resolve('/')}
        ><Icon name="trips" />My trips<span class="count">3</span></a
      >
    </nav>
    <div class="nav-destinations">
      <span class="eyebrow">YOUR NEXT CHAPTERS</span
      >{#each planner.plans.trips as trip (trip.id)}<a
          href={resolve('/trips/[id]', { id: trip.id })}
          class:current={page.params.id === trip.id}
          ><span class={`destination-dot ${trip.id}`}></span>{trip.country ===
          'Japan'
            ? 'Kyoto'
            : trip.id === 'lisbon'
              ? 'Lisbon'
              : 'The Dolomites'}<span class="tiny-arrow">↗</span></a
        >{/each}
    </div>
    <div class="sidebar-bottom">
      <div class="notebook">
        <Icon name="sun" />
        <p>Good plans.<br /><strong>Great detours.</strong></p>
        <span>A little structure. A lot of possibility.</span>
      </div>
      <div class="local-badge"><span></span>Just yours, on this device</div>
      <button class="reset-button" onclick={openReset}>Reset demo plans</button>
    </div>
  </aside>
  <div class="app-content">
    <header class="topbar">
      <div class="breadcrumb">
        <a href={resolve('/')}>My trips</a>{#if page.params.id}<span>/</span
          ><span
            >{page.params.id === 'dolomites'
              ? 'The Dolomites'
              : page.params.id === 'kyoto'
                ? 'Kyoto'
                : 'Lisbon'}</span
          >{/if}
      </div>
      <span class="demo-chip">A personal planning space</span>
      <div class="file-tools">
        <button class="subtle" onclick={exportPlans}
          ><Icon name="download" /><span>Export plans</span></button
        ><button class="subtle" onclick={() => importInput.click()}
          ><Icon name="upload" /><span>Import</span></button
        ><input
          class="visually-hidden"
          bind:this={importInput}
          tabindex="-1"
          type="file"
          accept="application/json,.json"
          aria-label="Import Roam plans"
          onchange={importPlans}
        />
      </div>
    </header>
    {#if planner.warning}<div class="notice warning" role="alert">
        {planner.warning}{#if planner.state === 'corrupt'}<button
            onclick={() => planner.recover()}>Replace unreadable data</button
          >{/if}
      </div>{/if}
    {#if importError}<div class="notice warning" role="alert">
        {importError} Your current plans have not changed.<button
          aria-label="Dismiss import error"
          onclick={() => (importError = '')}>Dismiss</button
        >
      </div>{/if}
    <main id="main">{@render children()}</main>
    <footer class="page-footer">
      <button class="mobile-reset" onclick={openReset}>Reset demo plans</button>
      <span>Made for the way you wander.</span><span
        >Fictional plans · illustrative EUR estimates · no bookings</span
      >
    </footer>
  </div>
</div>
<div class:visible={!!planner.status} class="toast" role="status">
  <span>{planner.status}</span>{#if planner.history.length}<button
      onclick={() => planner.undo()}><Icon name="undo" />Undo</button
    >{/if}<button
    aria-label="Dismiss notification"
    onclick={() => (planner.status = '')}><Icon name="close" /></button
  >
</div>
<dialog
  bind:this={resetDialog}
  aria-labelledby="reset-title"
  oncancel={(event) => {
    event.preventDefault();
    closeReset();
  }}
>
  <div class="dialog-header">
    <span class="eyebrow">A FRESH PAGE</span><button
      class="icon-button"
      aria-label="Close reset dialog"
      onclick={closeReset}><Icon name="close" /></button
    >
  </div>
  <h2 id="reset-title">Start with the demo again?</h2>
  <p>
    This replaces all three plans on this device. Export your plans first if you
    want a separate backup. You can also undo this reset during this visit.
  </p>
  <div class="dialog-actions">
    <button class="secondary" onclick={closeReset}>Keep my plans</button><button
      class="primary"
      onclick={() => {
        planner.reset();
        closeReset();
      }}>Reset all plans</button
    >
  </div>
</dialog>
