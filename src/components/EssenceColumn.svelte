<script lang="ts">
  import { character } from '../store.svelte';
  import Tooltip from './Tooltip.svelte';

  let { 
    type, 
    title, 
    defenseName,
    value = $bindable(0), 
    computedValue, 
    children, 
  } = $props();

  function increment() {
    if (character.availableEssencePoints > 0) {
      value++;
    }
  }

  function decrement() {
    if (value > 0) {
      // Need to add logic later for warning if this makes child skills illegal
      value--;
    }
  }

  let isDiamond = $derived(character.diamondEssence === type);
  let isGold = $derived(character.goldEssence === type);
</script>

<div class={`stat-column ${type}`}>
  {#if isDiamond}
    <div class="essence-boost-label">Diamond Essence (+2) 💎</div>
  {:else if isGold}
    <div class="essence-boost-label">Gold Essence (+1) ⭐</div>
  {/if}
  <div class="stat-header">
    <div class="header-content">
      <h2>
        {title} 
        <div class="essence-controls">
          <Tooltip disabled={value <= 0} content="Cannot decrease below 0.">
            <button class="essence-btn" onclick={decrement} disabled={value <= 0}>-</button>
          </Tooltip>
          
          <Tooltip disabled={true} content={`Base Essence: ${value} | Origin Bonus: ${computedValue - value}`}>
            <input type="number" class="stat-input" readonly value={computedValue} />
          </Tooltip>

          <Tooltip disabled={character.availableEssencePoints <= 0} content="Not enough Essence points available.">
            <button class="essence-btn" onclick={increment} disabled={character.availableEssencePoints <= 0}>+</button>
          </Tooltip>
        </div>
      </h2>
    </div>
  </div>
  <div class="derived-stat">
    <div class="derived-header">
      <label for={`${type}-defense`}>{defenseName}</label>
      <input type="number" id={`${type}-defense`} class="derived-box" readonly value={10 + computedValue} />
    </div>
    <div class="derived-formula">
      <span>10 +</span>
      <div class="formula-box"><input type="number" id={`${type}-ess`} readonly value={computedValue} /><label for={`${type}-ess`}>ESSENCE</label></div>
      <span>+</span>
      <div class="formula-box"><input type="number" id={`${type}-prk`} readonly /><label for={`${type}-prk`}>PERKS</label></div>
      <span>+</span>
      <div class="formula-box"><input type="number" id={`${type}-arm`} readonly /><label for={`${type}-arm`}>ARMOR</label></div>
    </div>
  </div>

  <div class="skills-list">
    {@render children()}
  </div>
</div>

<style>
  .essence-controls {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  .essence-btn {
    background: var(--primary-purple);
    color: white;
    border: none;
    border-radius: 5px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
  }
  .essence-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  .essence-boost-label {
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: bold;
    color: var(--primary-purple);
    background: white;
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid var(--primary-purple);
    white-space: nowrap;
    z-index: 20;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>
