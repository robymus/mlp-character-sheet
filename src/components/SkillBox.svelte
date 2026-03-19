<script lang="ts">
	import { character, type EssenceType } from '../store.svelte';
	import { SKILL_SPECIALIZATIONS } from '../data/specializations';
	import Tooltip from './Tooltip.svelte';

	let {
		skillName,
		isModifier = false,
		labels = [],
		essenceLimit = 0,
		essenceType,
	} = $props<{
		skillName: string;
		isModifier?: boolean;
		labels?: string[];
		essenceLimit: number;
		essenceType: EssenceType;
	}>();

	let finalLabels = $derived(
		labels.length > 0
			? labels
			: isModifier
				? ['+1', '+2', '+3', '+4', '+5', '+6']
				: ['D2', 'D4', 'D6', 'D8', 'D10', 'D12'],
	);
	let displayName = $derived(skillName.replace(/_/g, ' ').toUpperCase());

	let specs = $derived(SKILL_SPECIALIZATIONS[skillName] || []);
	let hasSpecs = $derived(specs.length > 0);

	// Initialize store if missing
	$effect(() => {
		if (character.skills[skillName] === undefined) {
			character.skills[skillName] = 0;
		}
		if (hasSpecs && !character.specializations[skillName]) {
			character.specializations[skillName] = [];
		}
	});

	let currentRank = $derived(character.skills[skillName] || 0);
	let activeSpecs = $derived(character.specializations[skillName] || []);
	let specsUnlocked = $derived(currentRank >= 2); // D4 = rank 2

	function handleRankClick(rank: number) {
		if (rank === currentRank) {
			character.skills[skillName] = rank - 1;
		} else if (rank > currentRank) {
			if (rank > essenceLimit) return;
			const cost = rank - currentRank;
			const available = character.spendableSkillPointsIn(essenceType);
			if (available >= cost) {
				character.skills[skillName] = rank;
			}
		} else {
			// Downgrading — remove specializations if going below D4
			if (rank < 2 && activeSpecs.length > 0) {
				character.specializations[skillName] = [];
			}
			character.skills[skillName] = rank;
		}
	}

	function toggleSpec(specName: string) {
		if (!specsUnlocked) return;

		const current = character.specializations[skillName] || [];
		const idx = current.indexOf(specName);

		if (idx >= 0) {
			// Remove
			character.specializations[skillName] = current.filter((s) => s !== specName);
		} else {
			// Add — check SP available
			const available = character.spendableSkillPointsIn(essenceType);
			if (available >= 1) {
				character.specializations[skillName] = [...current, specName];
			}
		}
	}

	function getTooltipWarning(rank: number): string {
		if (rank <= currentRank) return '';
		if (rank > essenceLimit)
			return `Requires ${essenceType.toUpperCase()} Essence rank ${rank} to unlock.`;
		const cost = rank - currentRank;
		const available = character.spendableSkillPointsIn(essenceType);
		if (available < cost) return `Not enough Skill Points. Need ${cost}, have ${available}.`;
		return '';
	}

	function getSpecWarning(specName: string): string {
		if (activeSpecs.includes(specName)) return '';
		if (!specsUnlocked) return 'Requires at least D4 rank in this skill.';
		const available = character.spendableSkillPointsIn(essenceType);
		if (available < 1) return 'Not enough Skill Points.';
		return '';
	}
</script>

<div class="skill-group">
	<div class="skill-header">
		<span class="skill-name">{displayName}</span>
		<div class="dice-track">
			{#each finalLabels as label, index (label)}
				{@const rank = index + 1}
				{@const warning = getTooltipWarning(rank)}
				{@const disabled = warning !== ''}
				{@const checked = currentRank >= rank}

				<Tooltip {disabled} content={warning}>
					<div class="dice-box">
						<label for={`${skillName}-${label}`}>{label}</label>
						<div
							id={`${skillName}-${label}`}
							class="custom-checkbox"
							class:checked
							class:disabled
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
	{#if hasSpecs}
		<div class="skill-specialization" class:specs-locked={!specsUnlocked}>
			<span class="spec-label">specialized?</span>
			<div class="spec-rows">
				{#each specs as spec (spec.name)}
					{@const isActive = activeSpecs.includes(spec.name)}
					{@const specWarning = getSpecWarning(spec.name)}
					{@const specDisabled = !isActive && specWarning !== ''}
					<div class="spec-row">
						<Tooltip disabled={specDisabled} content={specWarning}>
							<div
								class="spec-toggle"
								class:active={isActive}
								class:disabled={specDisabled}
								onclick={() => toggleSpec(spec.name)}
								role="button"
								tabindex="0"
								onkeydown={(e) => e.key === 'Enter' && toggleSpec(spec.name)}
							></div>
						</Tooltip>
						<Tooltip alwaysShow content={spec.description}>
							<span class="spec-name" class:active={isActive}>{spec.name}</span>
						</Tooltip>
					</div>
				{/each}
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
	.spec-toggle {
		width: 12px;
		height: 12px;
		border: 1px solid var(--border-color);
		border-radius: 50%;
		cursor: pointer;
		background-color: white;
		flex-shrink: 0;
	}
	.spec-toggle.active {
		background-color: var(--primary-purple);
	}
	.spec-toggle.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.spec-name {
		font-size: 14px;
		font-family: var(--font-label);
		color: #666;
		cursor: help;
		border-bottom: 1px dotted #aaa;
	}
	.spec-name.active {
		color: var(--primary-purple);
		font-weight: bold;
	}
	.specs-locked {
		opacity: 0.4;
	}
	.spec-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.spec-rows {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.skill-specialization {
		margin-top: 2px;
		margin-left: 4px;
	}
	.spec-label {
		font-size: 14px;
		color: #999;
		text-transform: uppercase;
		font-family: var(--font-label);
	}
</style>
