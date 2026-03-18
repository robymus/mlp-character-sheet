<script lang="ts">
  import { character } from '../store.svelte';
  import CutieMarkSelector from './CutieMarkSelector.svelte';
  import OriginModal from './OriginModal.svelte';
  import RoleModal from './RoleModal.svelte';
  import Tooltip from './Tooltip.svelte';

  // Derived movement speed logic
  // Typically derived from Speed Essence/Evasion, but the rulebook might just say 30ft or 40ft? 
  // Let's check rulebook simplification: "Movement: Displays static derived speed, EXCEPT for Pegasus with Air Born perk"
  // If Pegasus and Air Born, dropdown. Otherwise static. Let's make it static '40ft' placeholder for now, 
  // until we know the exact derivation formula for MLP roleplaying.
  let isAirBornPegasus = $derived(character.origin === 'Pegasus' && character.perks.includes('Air Born'));
  
  let showOriginModal = $state(false);
  let showRoleModal = $state(false);
</script>

<header class="sheet-header">
  <div class="logo-area">
    <CutieMarkSelector />
    <div class="logo-wrapper">
      <img src="/logo.png" alt="My Little Pony Roleplaying Game" class="logo" />
    </div>
  </div>

  <div class="header-fields">
    <div class="field-group name-group">
      <input type="text" id="name" bind:value={character.name} />
      <label for="name">NAME</label>
    </div>
    <div class="field-group pronouns-group">
      <input type="text" id="pronouns" bind:value={character.pronouns} />
      <label for="pronouns">PRONOUNS</label>
    </div>
    <div class="level-badge" style="display: flex; flex-direction: column; align-items: center;">
      <label for="level">LEVEL</label>
      <input type="number" id="level" readonly value={character.level} />
    </div>

    <!-- Origin Selector dropdown -->
    <div class="field-group origin-group">
      <button 
        id="origin" 
        class="origin-dropdown" 
        onclick={() => showOriginModal = true}
      >
        {character.origin || 'Select Origin...'}
      </button>
      <label for="origin">ORIGIN</label>
    </div>
    <div class="field-group role-group">
      <button id="role" class="origin-dropdown" onclick={() => showRoleModal = true}>
        {character.role ? character.role.replace('Spirit of ', '') : 'Select Role...'}
      </button>
      <label for="role">ROLE</label>
    </div>

    <div class="field-group description-group">
      <input type="text" id="description" bind:value={character.description} />
      <label for="description">DESCRIPTION</label>
    </div>
    <div class="field-group languages-group">
      <input type="text" id="languages" bind:value={character.languages} />
      <label for="languages">LANGUAGES</label>
    </div>
    <div class="field-group movement-group">
      <input type="text" id="movement" readonly value={character.origin ? character.movement : ''} />
      <label for="movement">MOVEMENT</label>
    </div>
  </div>
</header>

<OriginModal bind:showModal={showOriginModal} />
<RoleModal bind:showModal={showRoleModal} />

<style>
  .origin-dropdown {
    width: 100%;
    border: 2px solid var(--border-color);
    border-radius: 20px;
    padding: 8px 12px;
    font-family: var(--font-label);
    font-size: 14px;
    outline: none;
    background-color: transparent;
    transition: all 0.2s ease;
    text-align: left;
    cursor: pointer;
  }
  .origin-dropdown:focus {
    border-color: var(--heart-color);
    box-shadow: 0 0 5px rgba(139, 90, 150, 0.3);
  }
</style>
