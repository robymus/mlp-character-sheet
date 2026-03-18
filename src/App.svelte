<script lang="ts">
  import { character } from './store.svelte';
  import CutieMarkSelector from './components/CutieMarkSelector.svelte';
  import SkillBox from './components/SkillBox.svelte';
  import BasicInfo from './components/BasicInfo.svelte';
  import OriginInfluence from './components/OriginInfluence.svelte';
  import BackgroundTraits from './components/BackgroundTraits.svelte';
  import EssenceColumn from './components/EssenceColumn.svelte';
  import Perks from './components/Perks.svelte';
  import MagicAttack from './components/MagicAttack.svelte';
</script>

<div class="floating-essence-counter">
  <div class="essence-bubble" class:empty={character.availableEssencePoints <= 0}>
    <span class="essence-num">{character.availableEssencePoints}</span>
    <span class="essence-label">ESSENCE POINTS</span>
  </div>
</div>

<div class="sheet-container" class:requires-origin={!character.origin}>
    <section class="page page-1">

      <BasicInfo />

      <section class="middle-section">
        <OriginInfluence />

        <div class="points-center">
          <div class="field-group badge-box wealth-box">
            <input type="text" id="wealth-status" />
            <label for="wealth-status">WEALTH STATUS</label>
          </div>
          <div class="field-group badge-box health-box">
            <input type="number" id="health" class="health-input" readonly />
            <label for="health">HEALTH</label>
          </div>
        </div>

        <div class="field-group-bubble attack-table-container">
          <div class="bubble-header-container">
            <h2 class="bubble-header">ATTACK</h2>
          </div>
          <table class="attack-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>RANGE</th>
                <th>ATTACK</th>
                <th>EFFECTS</th>
                <th>NOTES</th>
              </tr>
            </thead>
            <tbody>
              {#each character.attacks as attack}
              <tr>
                <td><input type="text" bind:value={attack.name} /></td>
                <td><input type="text" bind:value={attack.range} /></td>
                <td><input type="text" bind:value={attack.attack} /></td>
                <td><input type="text" bind:value={attack.effects} /></td>
                <td><input type="text" bind:value={attack.notes} /></td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>

      <section class="stats-section">
        <!-- STRENGTH -->
        <EssenceColumn 
          type="strength" 
          title="STRENGTH" 
          defenseName="TOUGHNESS" 
          bind:value={character.baseEssenceStr} 
          computedValue={character.essenceStr}
        >
          <SkillBox skillName="athletics" essenceLimit={character.essenceStr} />
          <SkillBox skillName="brawn" essenceLimit={character.essenceStr} />
          <SkillBox skillName="conditioning" isModifier={true} essenceLimit={character.essenceStr} />
          <SkillBox skillName="intimidation" essenceLimit={character.essenceStr} />
          <SkillBox skillName="might" essenceLimit={character.essenceStr} />
        </EssenceColumn>

        <!-- SPEED -->
        <EssenceColumn 
          type="speed" 
          title="SPEED" 
          defenseName="EVASION" 
          bind:value={character.baseEssenceSpd} 
          computedValue={character.essenceSpd}
        >
          <SkillBox skillName="acrobatics" essenceLimit={character.essenceSpd} />
          <SkillBox skillName="driving" essenceLimit={character.essenceSpd} />
          <SkillBox skillName="finesse" essenceLimit={character.essenceSpd} />
          <SkillBox skillName="infiltration" essenceLimit={character.essenceSpd} />
          <SkillBox skillName="initiative" isModifier={true} essenceLimit={character.essenceSpd} />
          <SkillBox skillName="targeting" essenceLimit={character.essenceSpd} />
        </EssenceColumn>

        <!-- SMARTS -->
        <EssenceColumn 
          type="smarts" 
          title="SMARTS" 
          defenseName="WILLPOWER" 
          bind:value={character.baseEssenceSma} 
          computedValue={character.essenceSma}
        >
          <SkillBox skillName="alertness" essenceLimit={character.essenceSma} />
          <SkillBox skillName="culture" essenceLimit={character.essenceSma} />
          <SkillBox skillName="science" essenceLimit={character.essenceSma} />
          <SkillBox skillName="survival" essenceLimit={character.essenceSma} />
          <SkillBox skillName="technology" essenceLimit={character.essenceSma} />
        </EssenceColumn>

        <!-- SOCIAL -->
        <EssenceColumn 
          type="social" 
          title="SOCIAL" 
          defenseName="CLEVERNESS" 
          bind:value={character.baseEssenceSoc} 
          computedValue={character.essenceSoc}
        >
          <SkillBox skillName="animal_handling" essenceLimit={character.essenceSoc} />
          <SkillBox skillName="deception" essenceLimit={character.essenceSoc} />
          <SkillBox skillName="performance" essenceLimit={character.essenceSoc} />
          <SkillBox skillName="persuasion" essenceLimit={character.essenceSoc} />
          <SkillBox skillName="streetwise" essenceLimit={character.essenceSoc} />
        </EssenceColumn>
      </section>

    </section>

    <!-- PAGE 2 -->
    <section class="page page-2">
      <!-- Two main columns for Background Bonds and Perks -->
      <div class="row-two-cols bonds-perks-row">
        <BackgroundTraits />
        <Perks />
      </div>

      <MagicAttack />

    </section>
</div>
