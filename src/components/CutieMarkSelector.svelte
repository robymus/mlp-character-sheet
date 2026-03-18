<script lang="ts">
  import { character } from '../store.svelte';
  import { onMount } from 'svelte';
  
  // Cutie marks list from the original codebase
  import cutieMarksList from '../../backup_vanilla/src/cutiemarks.js';

  let isModalOpen = $state(false);

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function selectCutieMark(filename: string) {
    character.cutieMark = `/cutiemarks/${filename}`;
    closeModal();
  }

  function selectRandom() {
    const randomIndex = Math.floor(Math.random() * cutieMarksList.length);
    character.cutieMark = `/cutiemarks/${cutieMarksList[randomIndex]}`;
    closeModal();
  }

  onMount(() => {
    if (character.cutieMark.includes('random_choice')) {
      const randomIndex = Math.floor(Math.random() * cutieMarksList.length);
      character.cutieMark = `/cutiemarks/${cutieMarksList[randomIndex]}`;
    }
  });

  // Helper to format clean names for the title hover
  function cleanTitle(filename: string) {
    let clean = filename.split('.')[0].replace(/_/g, ' ');
    if (clean.startsWith('AiP CM ')) clean = clean.substring(7);
    if (clean.startsWith('HappyStudio ')) clean = clean.substring(12);
    if (clean.startsWith('PonyMaker ')) clean = clean.substring(10);
    return clean;
  }

</script>

<!-- The trigger container -->
<div class="cutie-mark-container" title="Click to change Cutie Mark" onclick={openModal} onkeydown={(e) => e.key === 'Enter' && openModal()} role="button" tabindex="0">
  <img id="current-cutie-mark" src={character.cutieMark} alt="Cutie Mark" />
</div>

<!-- The Modal -->
{#if isModalOpen}
  <div class="modal-overlay" onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }} role="dialog" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && closeModal()}>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Select a Cutie Mark</h2>
        <button class="close-btn" onclick={closeModal}>&times;</button>
      </div>
      <div class="cutie-mark-grid">
        <!-- Random Choice Button -->
        <div class="cutie-mark-item" onclick={selectRandom} onkeydown={(e) => e.key === 'Enter' && selectRandom()} role="button" tabindex="0">
          <img src="/cutiemarks/random_choice.svg" alt="Random Choice" title="Random Choice" />
        </div>

        <!-- All mapped cutie marks -->
        {#each cutieMarksList as filename}
          <div class="cutie-mark-item" onclick={() => selectCutieMark(filename)} onkeydown={(e) => e.key === 'Enter' && selectCutieMark(filename)} role="button" tabindex="0">
            <img src="/cutiemarks/{filename}" alt={cleanTitle(filename)} title={cleanTitle(filename)} loading="lazy" />
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* The global style.css handles most modal logic, but we can scope specific overrides here if needed */
</style>
