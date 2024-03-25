<style>

</style>
        
<script lang="ts">
    import './index.css';
	import { onMount } from 'svelte'
	/**
	 * @type {any}
	 */
	let Aubio;
	let QrCode
    import '$lib/tuner-module/tuner.js';
    import '$lib/tuner-module/frequency-bars.js';
    import '$lib/tuner-module/notes.js';
    import '$lib/tuner-module/meter.js';
	onMount(async () => {
      await import('$lib/tuner-module/app.js');
	})
</script>

    <canvas class="frequency-bars"></canvas>
<div class="meter">
    <div class="meter-dot"></div>
    <div class="meter-pointer"></div>
</div>
<div class="notes">
  <div class="notes-list"></div>
  <div class="frequency">
  <span>Hz</span>
  </div>
</div>
<div class="a4">A<sub>4</sub> = <span>440</span> Hz</div>
<label class="auto">
    Auto
    <input type="checkbox" checked />
</label>