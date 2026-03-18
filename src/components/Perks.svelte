<script lang="ts">
  import { character } from '../store.svelte';
  import { GENERAL_PERKS, GENERAL_PERK_NAMES } from '../data/rulebook';

  function meetsRequirements(perkName: string): { valid: boolean, reason: string } {
     const reqs = GENERAL_PERKS[perkName];
     if (perkName === 'Spellcasting') {
       return { valid: false, reason: 'Spellcasting must be unlocked via the Magic section.' };
     }
     
     if (reqs.reqSkill) {
        for (const [skill, val] of Object.entries(reqs.reqSkill)) {
           if ((character.skills[skill] || 0) < val) {
              return { valid: false, reason: `Requires ${skill.replace(/_/g, ' ').toUpperCase()} rank ${val}` };
           }
        }
     }
     return { valid: true, reason: '' };
  }

  function addPerk(e: Event) {
    const target = e.target as HTMLSelectElement;
    const val = target.value;
    if (val && !character.perks.includes(val)) {
        character.perks.push(val);
    }
    target.value = ''; // reset
  }
  
  function removePerk(index: number) {
    character.perks.splice(index, 1);
  }
</script>

<div class="field-group-bubble perks-group">
  <div class="bubble-header-container">
    <h2 class="bubble-header">PERKS</h2>
  </div>
  
  <div class="perks-container">
     <div class="perk-section">
       <div class="perk-item read-only">
          <span class="perk-name">Cutie Mark Perk</span>
          <p class="perk-desc italic-note">Please discuss your cutie mark perk with your GM.</p>
       </div>
     </div>
     
     <div class="perk-section">
       <span class="perk-label">Origin Perk:</span>
       {#if character.origin === 'Earth Pony'}
            <div class="perk-item read-only origin-box">
               <span class="perk-name">Adaptable</span>
               <p class="perk-desc">
                 Once per scene, when using a Skill from 
                 <select bind:value={character.adaptableEssence} style="padding: 2px; border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-label); background: white;">
                    <option value="strength">Strength</option>
                    <option value="speed">Speed</option>
                    <option value="smarts">Smarts</option>
                    <option value="social">Social</option>
                 </select>
                 Essence, you can make the roll as though you have a Specialization.
               </p>
            </div>
       {:else if character.origin === 'Pegasus'}
            <div class="perk-item read-only origin-box" style="margin-bottom: 5px;">
               <span class="perk-name">Air Born</span>
               <p class="perk-desc">
                 You were born with wings but without the strength to use them. Movement speed: 
                 <select bind:value={character.movement} style="padding: 2px; border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-label); background: white;">
                    <option value="🐎 15ft / 🪽 45ft">🐎 15ft Ground / 🪽 45ft Air</option>
                    <option value="🐎 30ft / 🪽 30ft">🐎 30ft Ground / 🪽 30ft Air</option>
                    <option value="🐎 45ft / 🪽 15ft">🐎 45ft Ground / 🪽 15ft Air</option>
                 </select>
               </p>
            </div>
            <div class="perk-item read-only origin-box">
               <span class="perk-name">Lighter Than Air</span>
               <p class="perk-desc">
                 Aerial acrobatics are in your hollow bones. You get ↑1 on Acrobatics Skill Tests. You can land on clouds and walk around Pegasus sky cities.
               </p>
            </div>
       {:else if character.origin === 'Unicorn'}
            <div class="perk-item read-only origin-box">
               <span class="perk-name">Telekinesis</span>
               <p class="perk-desc">
                 Unicorns learn to use their telekinetic abilities to manipulate objects at a distance, which makes their horn glow with magical power.
               </p>
            </div>
       {:else}
           <p class="empty-state">Select an Origin to see Origin Perks.</p>
       {/if}
     </div>
     
     {#if character.origin !== 'Pegasus'}
       <div class="perk-section">
         <span class="perk-label">General Perks:</span>
         
         {#if character.origin === 'Earth Pony'}
           <button class="perk-select" disabled style="background:#efefef; cursor:not-allowed; text-align:left;">Select general perk</button>
         {:else if character.origin === 'Unicorn'}
           <div class="added-perks">
             <div class="perk-item added-perk-box">
                 <div class="perk-item-header">
                   <span class="perk-name">Magical</span>
                 </div>
                 <p class="perk-desc">
                   You are a magical pony and are capable of casting spells.
                 </p>
             </div>
           </div>
         {:else}
           <select onchange={addPerk} class="perk-select">
              <option value="">+ Add General Perk</option>
              {#each GENERAL_PERK_NAMES as perk}
                 {@const req = meetsRequirements(perk)}
                 <option value={perk} disabled={!req.valid || character.perks.includes(perk)}>
                   {perk} {req.valid ? '' : `(${req.reason})`}
                 </option>
              {/each}
           </select>
           
           <div class="added-perks">
              {#each character.perks as perk, i}
                 <div class="perk-item added-perk-box">
                    <div class="perk-item-header">
                      <span class="perk-name">{perk}</span>
                      <button class="remove-btn" onclick={() => removePerk(i)}>&times;</button>
                    </div>
                    <p class="perk-desc">
                      {GENERAL_PERKS[perk]?.description}
                      {#if perk === 'Animal Pet'}
                         <br/><strong class="alert-note">Note: Please discuss your pet with the GM.</strong>
                      {/if}
                    </p>
                 </div>
              {/each}
           </div>
         {/if}
       </div>
     {/if}
     
     {#if character.role}
       {@const roleName = character.role.replace('Spirit of ', '')}
       <div class="perk-section" style="margin-top: 15px;">
         <span class="perk-label">Role Perks:</span>
         
         <div class="perk-item read-only">
            <span class="perk-name">A Talent for {roleName}</span>
            <p class="perk-desc">You can perform actions related to {roleName} more easily than most ponies.</p>
         </div>

         <div class="perk-item read-only">
            <span class="perk-name">{roleName} is Magic</span>
            <p class="perk-desc">Once per scene, when you act in the spirit of {roleName}, you gain a Friendship point.</p>
         </div>

         <div class="perk-item read-only">
            <span class="perk-name">Friendship Circle</span>
            <p class="perk-desc">Once per scene, a pony in your group can spend a Friendship Point as a Standard action to form a Friendship Circle.</p>
         </div>

         {#if roleName === 'Generosity'}
            <div class="perk-item read-only role-special-box">
               <span class="perk-name">Generosity of Spirit</span>
               <p class="perk-desc">You can grant another player character ↑1 to any Skill Test before they roll the dice. You suffer a downshift ↓1 on your next Skill Test.</p>
            </div>
         {:else if roleName === 'Honesty'}
            <div class="perk-item read-only role-special-box">
               <span class="perk-name">Speak Your Truth</span>
               <p class="perk-desc">
                 Ponies tend to focus on your words and not your tone or theatrics. When you increase 
                 <select bind:value={character.honestyEssence} class="inline-select">
                    <option value="strength">Strength</option>
                    <option value="speed">Speed</option>
                    <option value="smarts">Smarts</option>
                    <option value="social">Social</option>
                 </select>
                 , you can spend the skill point on Persuasion.
               </p>
            </div>
         {:else if roleName === 'Kindness'}
            <div class="perk-item read-only role-special-box">
               <span class="perk-name">Empathy</span>
               <p class="perk-desc">
                 Your greatest skill is understanding how other creatures feel. Skill test is based on 
                 <select bind:value={character.kindnessSkill} class="inline-select">
                    <option value="alertness">Alertness</option>
                    <option value="animal_handling">Animal Handling</option>
                    <option value="persuasion">Persuasion</option>
                 </select>
                 .
               </p>
            </div>
         {:else if roleName === 'Laughter'}
            <div class="perk-item read-only role-special-box">
               <span class="perk-name">Cheer</span>
               <p class="perk-desc">You live to spread cheer, but tapping into your own cheer reserves can take a lot out of you. You have 2 Cheer Points. Cheer Points can be used as a Free Action to reroll a failed Performance Skill Test.</p>
            </div>
         {:else if roleName === 'Loyalty'}
            <div class="perk-item read-only role-special-box">
               <span class="perk-name">Reactionary</span>
               <p class="perk-desc">You're quick to Spring into Action. You get ↑1 on Initiative. If you're not first in Initiative order, you can roll a new Initiative once per round.</p>
            </div>
         {:else if roleName === 'Magic'}
            <div class="perk-item read-only role-special-box">
               <span class="perk-name">Mystical Understanding</span>
               <p class="perk-desc">You understand the magic of the universe, and can use it when you need it. You have 2 Mystical Points to spend on: Essential Research, Magically Fit In, Refocus, Spellcosting, Spellcialize.</p>
            </div>
         {/if}
       </div>
     {/if}
  </div>
</div>

<style>
  .perks-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 5px;
  }
  .perk-section {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .perk-label {
    font-size: 12px;
    color: var(--primary-purple);
    font-weight: bold;
    text-transform: uppercase;
  }
  .perk-item {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 8px;
  }
  .perk-item.read-only {
    background: #fafafa;
    border-style: dashed;
  }
  .origin-box {
    border-color: #ffd700;
    background: #fffae6 !important;
  }
  .role-special-box {
    border-color: #793D87;
    background: #fdf5ff !important;
  }
  .inline-select {
    padding: 2px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    font-family: var(--font-label);
    background: white;
  }
  .perk-name {
    font-weight: bold;
    font-size: 14px;
    display: block;
    margin-bottom: 2px;
  }
  .perk-desc {
    margin: 0;
    font-size: 12px;
    color: #444;
  }
  .italic-note {
    font-style: italic;
    color: #888;
  }
  .alert-note {
    color: #e74c3c;
  }
  .perk-select {
    width: 100%;
    padding: 6px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
  }
  .added-perk-box {
    margin-top: 5px;
  }
  .perk-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .remove-btn {
    background: none;
    border: none;
    color: #cc0000;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    padding: 0 5px;
  }
  .remove-btn:hover {
    color: #ff0000;
  }
  .empty-state {
    font-size: 12px;
    color: #888;
    font-style: italic;
  }
</style>
