<script lang="ts">
	import { character } from '../store.svelte';
	import { GENERAL_PERKS, type GeneralPerk } from '../data/generalPerks';

	let {
		showModal = $bindable(false),
		onselect,
	}: {
		showModal: boolean;
		onselect: (perk: GeneralPerk) => void;
	} = $props();

	/** Check if prerequisite is met */
	function checkPrerequisite(perk: GeneralPerk): { met: boolean; reason: string } {
		if (!perk.prerequisite) return { met: true, reason: '' };

		if (perk.prerequisite.essence) {
			for (const [ess, minVal] of Object.entries(perk.prerequisite.essence)) {
				const current = character.essenceValue(ess as 'strength' | 'speed' | 'smarts' | 'social');
				if (current < minVal!) {
					const label = ess.charAt(0).toUpperCase() + ess.slice(1);
					return { met: false, reason: `Requires ${label} Essence ${minVal}+` };
				}
			}
		}

		if (perk.prerequisite.skill) {
			for (const [skill, minRank] of Object.entries(perk.prerequisite.skill)) {
				const current = character.skills[skill] || 0;
				if (current < minRank) {
					const dieLabel = ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12'][minRank] || `rank ${minRank}`;
					const skillLabel = skill.replace(/_/g, ' ');
					return { met: false, reason: `Requires ${skillLabel} ${dieLabel}+` };
				}
			}
		}

		if (perk.prerequisite.special) {
			return { met: false, reason: perk.prerequisite.special };
		}

		return { met: true, reason: '' };
	}

	function canSelect(perk: GeneralPerk): boolean {
		const prereq = checkPrerequisite(perk);
		if (!prereq.met) return false;
		const count = character.generalPerks.filter((p) => p === perk.name).length;
		const max = perk.repeatable || 1;
		return count < max;
	}

	/** Perks to show (exclude Magical-prerequisite and Sonic Rainboom) */
	let displayPerks = $derived(
		GENERAL_PERKS.filter((p) => {
			if (
				p.name === 'Experienced Spellcaster' ||
				p.name === 'Extra Effective Spell' ||
				p.name === 'Long Lasting Spell' ||
				p.name === 'Potion Brewer'
			) {
				return false;
			}
			return true;
		}),
	);

	function selectPerk(perk: GeneralPerk) {
		onselect(perk);
		showModal = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (showModal && e.key === 'Escape') showModal = false;
	}

	function formatPrerequisite(perk: GeneralPerk): string {
		if (!perk.prerequisite) return '';
		const parts: string[] = [];
		if (perk.prerequisite.essence) {
			for (const [ess, val] of Object.entries(perk.prerequisite.essence)) {
				parts.push(`${ess.charAt(0).toUpperCase() + ess.slice(1)} ${val}+`);
			}
		}
		if (perk.prerequisite.skill) {
			for (const [skill, rank] of Object.entries(perk.prerequisite.skill)) {
				const dieLabel = ['', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12'][rank] || `rank ${rank}`;
				parts.push(`${skill.replace(/_/g, ' ')} ${dieLabel}+`);
			}
		}
		if (perk.prerequisite.special) {
			parts.push(perk.prerequisite.special);
		}
		return parts.join(', ');
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showModal}
	<div class="modal-backdrop" role="dialog">
		<div class="modal-content">
			<div class="modal-title-bar">
				<h2>Select General Perk</h2>
				<button class="close-btn" onclick={() => (showModal = false)}>&times;</button>
			</div>

			<div class="perks-grid">
				{#each displayPerks as perk (perk.name)}
					{@const available = canSelect(perk)}
					{@const prereq = checkPrerequisite(perk)}
					{@const prereqText = formatPrerequisite(perk)}
					<button
						class="perk-card"
						class:unavailable={!available}
						disabled={!available}
						onclick={() => selectPerk(perk)}
					>
						<div class="perk-card-name">{perk.name}</div>
						{#if prereqText}
							<div class="perk-prereq" class:unmet={!prereq.met}>
								Prerequisite: {prereqText}
							</div>
						{/if}
						<p class="perk-card-desc">{perk.fullDescription}</p>
						{#if perk.choices}
							<div class="perk-card-choices">
								Choices: {perk.choices.join(', ')}
							</div>
						{/if}
						{#if perk.repeatable && perk.repeatable > 1}
							<div class="perk-card-repeat">Can be taken up to {perk.repeatable} times</div>
						{/if}
						{#if perk.note}
							<div class="perk-card-note">{perk.note}</div>
						{/if}
					</button>
				{/each}
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
		background: rgba(0, 0, 0, 0.6);
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
		max-width: 1100px;
		width: 95%;
		max-height: 90vh;
		overflow-y: auto;
	}
	.modal-title-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-bottom: 20px;
	}
	h2 {
		text-align: center;
		color: var(--primary-purple);
		font-family: var(--font-main);
		margin: 0;
	}
	.close-btn {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		font-size: 28px;
		color: #888;
		cursor: pointer;
		line-height: 1;
		padding: 0 5px;
	}
	.close-btn:hover {
		color: var(--primary-purple);
	}
	.perks-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.perk-card {
		background: var(--fill-color-light);
		border: 2px solid var(--border-color);
		border-radius: 12px;
		padding: 12px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		display: flex;
		flex-direction: column;
		font-family: var(--font-label);
	}
	.perk-card:hover:not(:disabled) {
		transform: translateY(-3px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	.perk-card.unavailable {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.perk-card-name {
		font-family: var(--font-main);
		font-size: 15px;
		font-weight: bold;
		color: var(--primary-purple);
		margin-bottom: 6px;
	}
	.perk-prereq {
		font-size: 13px;
		color: #666;
		margin-bottom: 6px;
		font-style: italic;
	}
	.perk-prereq.unmet {
		color: #c33;
	}
	.perk-card-desc {
		font-size: 14px;
		color: #444;
		margin: 0 0 6px 0;
		line-height: 1.4;
	}
	.perk-card-choices {
		font-size: 13px;
		color: #555;
		margin-bottom: 4px;
	}
	.perk-card-repeat {
		font-size: 13px;
		color: #888;
		font-style: italic;
		margin-top: auto;
	}
	.perk-card-note {
		font-size: 13px;
		color: #e74c3c;
		font-weight: bold;
		margin-top: 4px;
	}

	@media (max-width: 768px) {
		.perks-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
