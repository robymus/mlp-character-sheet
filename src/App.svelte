<script lang="ts">
	import { character } from './store.svelte';
	import SkillBox from './components/SkillBox.svelte';
	import BasicInfo from './components/BasicInfo.svelte';
	import OriginInfluence from './components/OriginInfluence.svelte';
	import BackgroundTraits from './components/BackgroundTraits.svelte';
	import EssenceColumn from './components/EssenceColumn.svelte';
	import Perks from './components/Perks.svelte';
	import Magic from './components/Magic.svelte';
</script>

<div class="sheet-wrapper">
	<div class="sheet-container" class:requires-origin={!character.origin}>
		<section class="page page-1">
			<BasicInfo />

			<section class="middle-section">
				<OriginInfluence />

				<div class="points-center">
					<div class="field-group badge-box wealth-box">
						<input type="text" id="wealth-status" readonly value={character.wealthStatus} />
						<label for="wealth-status">WEALTH STATUS</label>
					</div>
					<div class="field-group badge-box health-box">
						<input
							type="number"
							id="health"
							class="health-input"
							readonly
							value={character.health}
						/>
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
							{#each character.spellAttacks as sa (sa.name)}
								<tr class="spell-attack-row">
									<td>{sa.name}</td>
									<td>{sa.range}</td>
									<td>{sa.attack}</td>
									<td>{sa.effects}</td>
									<td>{sa.notes}</td>
								</tr>
							{/each}
							{#each character.attacks as attack, i (i)}
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
				<div class="essence-bubble" class:empty={character.availableEssencePoints <= 0}>
					<span class="essence-num">{character.availableEssencePoints}</span>
					<span class="essence-label">ESSENCE POINTS</span>
				</div>
				<!-- STRENGTH -->
				<EssenceColumn
					type="strength"
					title="STRENGTH"
					defenseName="TOUGHNESS"
					bind:value={character.baseEssenceStr}
					computedValue={character.essenceStr}
				>
					<SkillBox
						skillName="athletics"
						essenceLimit={character.essenceStr}
						essenceType="strength"
					/>
					<SkillBox skillName="brawn" essenceLimit={character.essenceStr} essenceType="strength" />
					<SkillBox
						skillName="conditioning"
						isModifier={true}
						essenceLimit={character.essenceStr}
						essenceType="strength"
					/>
					<SkillBox
						skillName="intimidation"
						essenceLimit={character.essenceStr}
						essenceType="strength"
					/>
					<SkillBox skillName="might" essenceLimit={character.essenceStr} essenceType="strength" />
				</EssenceColumn>

				<!-- SPEED -->
				<EssenceColumn
					type="speed"
					title="SPEED"
					defenseName="EVASION"
					bind:value={character.baseEssenceSpd}
					computedValue={character.essenceSpd}
				>
					<SkillBox
						skillName="acrobatics"
						essenceLimit={character.essenceSpd}
						essenceType="speed"
					/>
					<SkillBox skillName="driving" essenceLimit={character.essenceSpd} essenceType="speed" />
					<SkillBox skillName="finesse" essenceLimit={character.essenceSpd} essenceType="speed" />
					<SkillBox
						skillName="infiltration"
						essenceLimit={character.essenceSpd}
						essenceType="speed"
					/>
					<SkillBox
						skillName="initiative"
						isModifier={true}
						essenceLimit={character.essenceSpd}
						essenceType="speed"
					/>
					<SkillBox skillName="targeting" essenceLimit={character.essenceSpd} essenceType="speed" />
				</EssenceColumn>

				<!-- SMARTS -->
				<EssenceColumn
					type="smarts"
					title="SMARTS"
					defenseName="WILLPOWER"
					bind:value={character.baseEssenceSma}
					computedValue={character.essenceSma}
				>
					<SkillBox
						skillName="alertness"
						essenceLimit={character.essenceSma}
						essenceType="smarts"
					/>
					<SkillBox skillName="culture" essenceLimit={character.essenceSma} essenceType="smarts" />
					<SkillBox skillName="science" essenceLimit={character.essenceSma} essenceType="smarts" />
					<SkillBox skillName="survival" essenceLimit={character.essenceSma} essenceType="smarts" />
					<SkillBox
						skillName="technology"
						essenceLimit={character.essenceSma}
						essenceType="smarts"
					/>
				</EssenceColumn>

				<!-- SOCIAL -->
				<EssenceColumn
					type="social"
					title="SOCIAL"
					defenseName="CLEVERNESS"
					bind:value={character.baseEssenceSoc}
					computedValue={character.essenceSoc}
				>
					<SkillBox
						skillName="animal_handling"
						essenceLimit={character.essenceSoc}
						essenceType="social"
					/>
					<SkillBox
						skillName="deception"
						essenceLimit={character.essenceSoc}
						essenceType="social"
					/>
					<SkillBox
						skillName="performance"
						essenceLimit={character.essenceSoc}
						essenceType="social"
					/>
					<SkillBox
						skillName="persuasion"
						essenceLimit={character.essenceSoc}
						essenceType="social"
					/>
					<SkillBox
						skillName="streetwise"
						essenceLimit={character.essenceSoc}
						essenceType="social"
					/>
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

			<Magic />
		</section>
	</div>
</div>
