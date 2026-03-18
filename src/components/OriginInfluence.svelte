<script lang="ts">
  import { character, type Origin } from '../store.svelte';
  import Tooltip from './Tooltip.svelte';
  import { INFLUENCE_NAMES, INFLUENCES } from '../data/rulebook';

  const origins: Origin[] = ['Earth Pony', 'Pegasus', 'Unicorn'];
  
  // Logic for adding/removing a second influence
  function handleAddInfluence() {
    if (character.influences.length < 2) {
      character.influences.push('');
      character.backgroundBonds.push('');
    }
  }

  function handleRemoveInfluence(index: number) {
    character.influences.splice(index, 1);
    character.backgroundBonds.splice(index, 1);
    
    if (character.influences.length < 2) {
      character.hangup = ''; // Clear hangup if we drop back to 1 influence
    }
  }

  function handleInfluenceChange(index: number, newInfluenceName: string) {
    character.influences[index] = newInfluenceName;
    if (newInfluenceName && INFLUENCES[newInfluenceName]) {
      const bonds = INFLUENCES[newInfluenceName];
      const randomBond = bonds[Math.floor(Math.random() * bonds.length)];
      character.backgroundBonds[index] = randomBond;
    } else {
      character.backgroundBonds[index] = '';
    }
  }
</script>

<div class="traits-left">
  <!-- Since origin is actually in the header originally, and influences in the middle section, 
       we should just keep them physically separate in the DOM if we want to match the CSS exactly. 
       Wait, let's just implement the Influence/Hang-up part here and rename this to InfluenceSection.svelte 
       or we can export fragments? Svelte 5 snippets are great for this, but let's keep it simple: 
       This component will just be the Influences & Hangups box. -->
       
  <div class="field-group influences-group">
    <div class="influences-container">
      {#if character.influences.length === 0}
        <select value="" onchange={(e) => handleInfluenceChange(0, e.currentTarget.value)}>
          <option value="">Select Influence 1...</option>
          {#each INFLUENCE_NAMES as name}
            <option value={name}>{name}</option>
          {/each}
        </select>
      {/if}
      
      {#each character.influences as influence, i}
        <div class="influence-row">
          <select value={influence} onchange={(e) => handleInfluenceChange(i, e.currentTarget.value)}>
            <option value="">Select Influence {i+1}...</option>
            {#each INFLUENCE_NAMES as name}
              <option value={name}>{name}</option>
            {/each}
          </select>
          {#if i === 1}
            <button class="remove-btn" onclick={() => handleRemoveInfluence(i)}>&times;</button>
          {/if}
        </div>
      {/each}

      {#if character.influences.length < 2}
        <button class="add-btn" onclick={handleAddInfluence}>+ Add 2nd Influence</button>
      {/if}
    </div>
    <label>INFLUENCES</label>
  </div>

  <div class="field-group hangups-group">
    <Tooltip 
      disabled={character.influences.length < 2} 
      content="A Hang-Up is mandatory when taking a second Influence."
    >
      <div style="height: 100%; width: 100%;">
        <textarea 
          id="hangups" 
          rows="3" 
          bind:value={character.hangup}
          placeholder={character.influences.length > 1 ? "Mandatory Hang-Up required..." : "Optional Hang-Up"}
          class:mandatory={character.influences.length > 1 && !character.hangup}
        ></textarea>
      </div>
    </Tooltip>
    <label for="hangups">HANG-UPS</label>
  </div>
</div>

<style>
  .traits-left {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
  }
  .influences-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-grow: 1;
    border: 2px solid var(--border-color);
    border-radius: 15px;
    padding: 8px 12px;
  }
  .influences-group > textarea, .influences-group > .influences-container {
    height: 100%;
  }
  .influence-row {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .influence-row select, .influences-container > select {
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 6px;
    font-size: 14px;
    flex-grow: 1;
    background: transparent;
  }
  .add-btn {
    background: none;
    border: 1px dashed var(--border-color);
    border-radius: 5px;
    color: var(--primary-purple);
    cursor: pointer;
    padding: 4px;
    font-size: 12px;
    margin-top: auto;
  }
  .add-btn:hover {
    background: var(--fill-color-light);
  }
  .remove-btn {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
  textarea.mandatory {
    border-color: #ff4444 !important;
    background-color: #fff0f0 !important;
  }
</style>
