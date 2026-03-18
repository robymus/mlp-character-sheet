<script lang="ts">
  import { character } from '../store.svelte';
  import { ROLES, type RoleType } from '../data/roles';

  let { showModal = $bindable(false) } = $props();

  let localRole = $state<RoleType | ''>(character.role as RoleType | '');

  $effect(() => {
    if (showModal) {
      localRole = character.role as RoleType | '';
    }
  });

  function confirm() {
    character.role = localRole;
    showModal = false;
  }

  function selectRole(r: RoleType) {
    localRole = r;
  }
</script>

{#if showModal}
<div class="modal-backdrop">
  <div class="modal-content">
    <h2>Select Your Role</h2>
    
    <div class="roles-grid">
      {#each ROLES as role}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="role-card" 
          class:selected={localRole === role.name}
          onclick={() => selectRole(role.name)}
        >
          <h3><span class="icon">{role.icon}</span> {role.name}</h3>
          <div class="role-desc">
            <p>{role.paragraphs[0].text}</p>
            {#if localRole === role.name}
              <div class="role-details">
                <h4>{role.paragraphs[1].heading}</h4>
                <p>{role.paragraphs[1].text}</p>
                <h4>{role.paragraphs[2].heading}</h4>
                <p>{role.paragraphs[2].text}</p>
              </div>
            {/if}
          </div>
          {#if localRole !== role.name}
            <div class="select-hint">Click to see details</div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="modal-actions">
      <button class="confirm-btn" disabled={!localRole} onclick={confirm}>Confirm Role</button>
    </div>
  </div>
</div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 20px;
    border: 4px solid var(--border-color);
    max-width: 1000px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
  }
  h2 {
    text-align: center;
    color: var(--primary-purple);
    font-family: var(--font-main);
    margin: 0 0 30px 0;
  }
  .roles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;
    align-items: start;
  }
  .role-card {
    background: var(--fill-color-light);
    border: 4px solid transparent; /* matches origin selection strategy */
    box-shadow: inset 0 0 0 2px var(--border-color);
    border-radius: 15px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s;
    display: flex;
    flex-direction: column;
    min-height: 250px;
  }
  .role-card:hover {
    transform: translateY(-4px);
    box-shadow: inset 0 0 0 2px var(--border-color), 0 5px 15px rgba(0,0,0,0.1);
  }
  .role-card.selected {
    border-color: var(--heart-color);
    background: white;
    box-shadow: inset 0 0 0 2px var(--heart-color), 0 0 15px rgba(139, 90, 150, 0.4);
    grid-row: span 2; /* Takes more vertical space when expanded */
  }
  .role-card h3 {
    margin: 0 0 10px 0;
    color: var(--primary-purple);
    font-family: var(--font-main);
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .role-desc {
    font-size: 13px;
    color: #444;
    line-height: 1.4;
    font-family: var(--font-label);
    flex-grow: 1;
  }
  .role-details {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed var(--border-color);
    animation: fadeIn 0.3s ease;
  }
  .role-details h4 {
    margin: 0 0 5px 0;
    color: var(--heart-color);
    font-family: var(--font-main);
    font-size: 14px;
  }
  .role-details p {
    margin: 0 0 10px 0;
  }
  .select-hint {
    text-align: center;
    font-size: 11px;
    color: #999;
    font-style: italic;
    margin-top: 10px;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .modal-actions {
    display: flex;
    justify-content: center;
    margin-top: 0;
  }
  .confirm-btn {
    background: var(--primary-purple);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 18px;
    border-radius: 30px;
    cursor: pointer;
    font-family: var(--font-main);
    font-weight: bold;
    transition: all 0.2s;
  }
  .confirm-btn:hover:not(:disabled) {
    background: var(--heart-color);
    transform: scale(1.05);
  }
  .confirm-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
