<script lang="ts">
  export let name = 'compass';
  const paths: Record<string, string> = {
    compass: 'm12 3 7 18-7-4-7 4 7-18Z M12 3v14',
    trips: 'M4 6h16v15H4z M8 6V3h8v3 M8 10v7m8-7v7',
    heart:
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    plus: 'M12 5v14M5 12h14',
    pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M12 7v5l3 2',
    people:
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z m4-3a4 4 0 0 1 0 8',
    download: 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4',
    upload: 'M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4',
    food: 'M5 3v7m4-7v7M5 7h4m-2 3v11M17 3v18m0-18c-4 3-4 9 0 9',
    leaf: 'M20 3C7 2 2 9 6 15s15 1 14-12Z M4 21 16 8',
    bed: 'M3 18V5m0 7h18v9m-18-3h18M6 9h4v3m2 0V8h6a3 3 0 0 1 3 3v1',
    train: 'M6 3h12v14H6z M6 10h12M9 21l-3-4m12 0 3 4M9 14h.01M15 14h.01',
    check: 'm5 12 4 4L19 6',
    undo: 'M8 4 3 9l5 5M3 9h10a7 7 0 0 1 0 14',
    close: 'm6 6 12 12M6 18 18 6',
    edit: 'm15 4 5 5-11 11-6 1 1-6L15 4Z M12 7l5 5',
    calendar: 'M4 5h16v16H4z M8 2v6m8-6v6M4 11h16',
    sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
  };
</script>

<svg
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"><path d={paths[name] ?? paths.compass} /></svg
>
