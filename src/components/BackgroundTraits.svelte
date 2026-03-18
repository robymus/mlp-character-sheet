<script lang="ts">
  import { character } from '../store.svelte';
  import { INFLUENCES } from '../data/rulebook';
</script>

<div class="field-group-bubble bg-bonds-group">
  <div class="bubble-header-container">
    <h2 class="bubble-header">BACKGROUND BONDS</h2>
  </div>
  
  <div class="bonds-container">
    {#if character.influences.length === 0}
      <div class="empty-state">Select an Influence to gain a Background Bond.</div>
    {:else}
      {#each character.influences as influence, i}
        {#if influence && INFLUENCES[influence]}
          <div class="bond-item">
            <label class="bond-label">{influence} Bond</label>
            <select bind:value={character.backgroundBonds[i]} class="bond-select">
              <option value="">Select a bond...</option>
              {#each INFLUENCES[influence] as bond}
                <option value={bond}>{bond}</option>
              {/each}
            </select>
          </div>
        {:else if influence}
          <div class="bond-item">
            <label class="bond-label">{influence} Bond</label>
            <textarea bind:value={character.backgroundBonds[i]} rows="3" placeholder="Enter custom bond..."></textarea>
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .bonds-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 10px;
    height: 100%;
    min-height: 180px;
  }
  .empty-state {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px;
  }
  .bond-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .bond-label {
    font-size: 12px;
    color: var(--primary-purple);
    font-weight: bold;
    text-transform: uppercase;
  }
  .bond-select, .bond-item textarea {
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 8px;
    font-family: var(--font-label);
    font-size: 14px;
    background: white;
  }
</style>
