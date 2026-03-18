<script lang="ts">
  import { character } from '../store.svelte';

  let isUnicorn = $derived(character.origin === 'Unicorn');

  let currentRank = $derived(character.magicRank);

  function handleRankClick(rank: number) {
    if (!isUnicorn) return;
    if (rank === currentRank) {
      character.magicRank = rank - 1;
    } else if (rank > currentRank) {
      const cost = rank - currentRank;
      if (rank <= character.essenceSma && character.availableSkillPoints >= cost) {
        character.magicRank = rank;
      }
    } else {
      character.magicRank = rank;
    }
  }
</script>

<div class="magic-attack-wrapper" class:disabled-section={!isUnicorn}>
  <!-- Magic Section -->
  <div class="magic-section">
    <div class="stat-header magic-header">
      <h2>MAGIC <input type="number" class="stat-input" readonly value={character.essenceSma} /></h2>
    </div>
    <div class="magic-content">
      <div class="spellcasting-left">
        <div class="spellcasting-title-row">
          <h3>SPELLCASTING</h3>
          <div class="spell-dice-container">
             {#each ['D2', 'D4', 'D6', 'D8', 'D10', 'D12'] as label, index}
               {@const rank = index + 1}
               {@const checked = currentRank >= rank}
               <div class="dice-col">
                 <span>{label}</span>
                 <div 
                   class="custom-checkbox" 
                   class:checked={checked}
                   onclick={() => handleRankClick(rank)}
                   role="button"
                   tabindex="0"
                   onkeydown={(e) => e.key === 'Enter' && handleRankClick(rank)}
                 ></div>
               </div>
             {/each}
          </div>
        </div>

        <div class="spell-list">
          <div class="spell-header-row">
            <span class="sub-label">MASTERED SPELLS</span>
            <span class="col-head">TIER</span>
            <span class="col-head">CIRCLE</span>
          </div>
          <div class="spell-body-row">
            <div class="spell-inputs-col">
              {#each character.masteredSpells as spell, i}
                <div class="spell-row">
                  <input type="text" class="spell-input" bind:value={spell.name} disabled={!isUnicorn} />
                  <input type="checkbox" class="spell-check" checked={spell.spec.length > 0} readonly disabled={!isUnicorn} />
                </div>
              {/each}
            </div>
            <div class="spell-spec-col">
              <span class="spec-label">specialized?</span>
            </div>
            <div class="spell-tier-col">
              {#each character.masteredSpells as spell, i}
                <input type="text" class="tier-input" bind:value={spell.tier} disabled={!isUnicorn} />
              {/each}
            </div>
            <div class="spell-circle-col">
              {#each character.masteredSpells as spell, i}
                <input type="text" class="circle-input" bind:value={spell.circle} disabled={!isUnicorn} />
              {/each}
            </div>
          </div>
        </div>
      </div>

      <div class="spellcasting-rank-table">
        <table>
          <thead>
            <tr>
              <th>SPELLCASTING RANK</th>
            </tr>
          </thead>
          <tbody>
            <tr class:active-rank={currentRank === 8}><td>(3D6)</td></tr>
            <tr class:active-rank={currentRank === 7}><td>(2D8)</td></tr>
            <tr class:active-rank={currentRank === 6}><td>D12</td></tr>
            <tr class:active-rank={currentRank === 5}><td>D10</td></tr>
            <tr class:active-rank={currentRank === 4}><td>D8</td></tr>
            <tr class:active-rank={currentRank === 3}><td>D6</td></tr>
            <tr class:active-rank={currentRank === 2}><td>D4</td></tr>
            <tr class:active-rank={currentRank === 1}><td>D2</td></tr>
            <tr class="base-die" class:active-rank={currentRank === 0}><td>BASE DIE</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>

<style>
  .disabled-section {
    opacity: 0.5;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .custom-checkbox {
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    cursor: pointer;
    background-color: white;
    margin: 0 auto;
  }
  .custom-checkbox.checked {
    background-color: var(--primary-purple);
  }
  .active-rank {
    background-color: var(--primary-purple);
    color: white;
    font-weight: bold;
  }
</style>
