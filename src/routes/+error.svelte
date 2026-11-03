<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
</script>

<svelte:head><title>A little off the path · Roam</title></svelte:head>
<div class="empty-page page-pad">
  <p class="eyebrow">{page.status} · A LITTLE OFF THE PATH</p>
  <h1>This chapter<br />is still unwritten.</h1>
  <p>Let’s head back to a place we know.</p>
  <a class="primary" href={resolve('/')}>Back to my trips →</a>
</div>
