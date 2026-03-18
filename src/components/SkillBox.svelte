<script lang="ts">
  import { character } from '../store.svelte';
  import Tooltip from './Tooltip.svelte';

  let { 
    skillName, 
    isModifier = false, 
    labels = [],
    essenceLimit = 0
  } = $props();

  let finalLabels = $derived(labels.length > 0 ? labels : (isModifier ? ['+1', '+2', '+3', '+4', '+5', '+6'] : ['D2', 'D4', 'D6', 'D8', 'D10', 'D12']));
  let displayName = $derived(skillName.replace(/_/g, ' ').toUpperCase());

  // Initialize store arrays if missing
  $effect(() => {
    if (character.skills[skillName] === undefined) {
      character.skills[skillName] = 0;
    }
    if (!isModifier && !character.specializations[skillName]) {
      character.specializations[skillName] = ['', '', ''];
    }
  });

  let currentRank = $derived(character.skills[skillName] || 0);

  function handleRankClick(rank: number) {
    // rank is 1-indexed (1 to 6)
    if (rank === currentRank) {
      // Toggle off to downgrade by 1
      character.skills[skillName] = rank - 1;
    } else if (rank > currentRank) {
      // Upgrading: check constraints
      const cost = rank - currentRank;
      
      // Magic allows bypassing standard essence rules slightly, but let's be strict for now
      if (rank > essenceLimit) {
        // We handle the warning via tooltip, but prevent the action here
        return;
      }
      
      if (character.availableSkillPoints >= cost) {
        character.skills[skillName] = rank;
      }
    } else {
      // Downgrading to a lower rank directly
      character.skills[skillName] = rank;
    }
  }

  function getTooltipWarning(rank: number): string {
    if (rank <= currentRank) return ''; // Always allowed to click current/lower
    if (rank > essenceLimit) return `Requires ${displayName} Essence rank ${rank} to unlock.`;
    const cost = rank - currentRank;
    if (character.availableSkillPoints < cost) return `Not enough Skill Points. Need ${cost}.`;
    return '';
  }
</script>

<div class="skill-group">
  <div class="skill-header">
      <span class="skill-name">{displayName}</span>
      <div class="dice-track">
         {#each finalLabels as label, index}
             {@const rank = index + 1}
             {@const warning = getTooltipWarning(rank)}
             {@const disabled = warning !== ''}
             {@const checked = currentRank >= rank}
             
             <Tooltip disabled={disabled} content={warning}>
               <div class="dice-box">
                   <label for={`${skillName}-${label}`}>{label}</label>
                   <!-- We use a custom styled div mapped to click instead of true checkbox for better control -->
                   <div 
                     id={`${skillName}-${label}`}
                     class="custom-checkbox" 
                     class:checked={checked}
                     class:disabled={disabled}
                     onclick={() => handleRankClick(rank)}
                     role="button"
                     tabindex="0"
                     onkeydown={(e) => e.key === 'Enter' && handleRankClick(rank)}
                    ></div>
               </div>
             </Tooltip>
         {/each}
      </div>
  </div>
  {#if !isModifier}
    <div class="skill-specialization">
        <span class="spec-label">specialized?</span>
        <div class="spec-rows">
          {#if character.specializations[skillName]}
            {#each [0, 1, 2] as i}
              <div class="spec-row">
                  <!-- In MLP RPG specializations are just text, no checkboxes needed usually, 
                        but the HTML had a checkbox. We'll link it to presence of text. -->
                  <input type="checkbox" class="spec-check" checked={character.specializations[skillName][i].length > 0} readonly />
                  <input type="text" class="spec-input" bind:value={character.specializations[skillName][i]} />
              </div>
            {/each}
          {/if}
        </div>
    </div>
  {/if}
</div>

<style>
  .custom-checkbox {
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    cursor: pointer;
    margin: 0;
    background-color: white;
  }
  .custom-checkbox.checked {
    background-color: var(--primary-purple);
  }
  .custom-checkbox.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .spec-check {
    pointer-events: none; /* Auto-managed by the text input */
  }
</style>
