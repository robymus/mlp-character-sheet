<script lang="ts">
	import { character } from '../store.svelte';
	import { SPELLS, type Spell, type SpellTier } from '../data/spells';

	let {
		showModal = $bindable(false),
		slotIndex = 0,
	}: {
		showModal: boolean;
		slotIndex: number;
	} = $props();

	/** What tiers a slot can hold based on its position */
	function availableTiersForSlot(idx: number): SpellTier[] {
		if (idx >= 4) return ['Elementary', 'Superior', 'Virtuoso'];
		if (idx >= 2) return ['Elementary', 'Superior'];
		return ['Elementary'];
	}

	let slotTiers = $derived(availableTiersForSlot(slotIndex));
	let currentSpellName = $derived(character.masteredSpells[slotIndex] || '');

	/** Spells already learned in other slots (can't learn duplicates) */
	let learnedSpells = $derived(
		character.masteredSpells.filter((s, i) => s !== '' && i !== slotIndex),
	);

	function isAvailable(spell: Spell): boolean {
		return slotTiers.includes(spell.tier) && !learnedSpells.includes(spell.name);
	}

	function selectSpell(spell: Spell) {
		if (!isAvailable(spell)) return;
		character.masteredSpells[slotIndex] = spell.name;
		showModal = false;
	}

	function clearSpell() {
		character.masteredSpells[slotIndex] = '';
		showModal = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (showModal && e.key === 'Escape') showModal = false;
	}

	function spellsByTier(tier: SpellTier): Spell[] {
		return SPELLS.filter((s) => s.tier === tier);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showModal}
	<div class="modal-backdrop" role="dialog">
		<div class="modal-content">
			<div class="modal-title-bar">
				<h2>Learn a Spell (Slot {slotIndex + 1})</h2>
				<button class="close-btn" onclick={() => (showModal = false)}>&times;</button>
			</div>

			{#if currentSpellName}
				<div class="current-spell-bar">
					<span>Currently learned: <strong>{currentSpellName}</strong></span>
					<button class="unlearn-btn" onclick={clearSpell}>Unlearn</button>
				</div>
			{/if}

			{#each ['Elementary', 'Superior', 'Virtuoso'] as tier (tier)}
				{@const tierSpells = spellsByTier(tier as SpellTier)}
				{@const tierAvailable = slotTiers.includes(tier as SpellTier)}
				<div class="tier-section" class:tier-locked={!tierAvailable}>
					<h3 class="tier-header">
						{tier} Spells
						{#if !tierAvailable}
							<span class="tier-req">(not available for this slot)</span>
						{/if}
					</h3>
					<div class="spells-grid">
						{#each tierSpells as spell (spell.name)}
							{@const learned = learnedSpells.includes(spell.name)}
							{@const selected = spell.name === currentSpellName}
							{@const available = tierAvailable && !learned}
							<button
								class="spell-card"
								class:selected
								class:unavailable={!available && !selected}
								disabled={!available && !selected}
								onclick={() => selectSpell(spell)}
							>
								<div class="spell-title">
									{spell.name}
									<span class="spell-circle">({spell.circle})</span>
								</div>
								<p class="spell-short">{spell.shortDescription}</p>
								<p class="spell-stats">{spell.stats}</p>
								<p class="spell-desc">{spell.description}</p>
							</button>
						{/each}
					</div>
				</div>
			{/each}
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

	.current-spell-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15px;
		padding: 10px 20px;
		margin-bottom: 20px;
		background: var(--fill-color-light);
		border-radius: 10px;
		font-family: var(--font-label);
		font-size: 14px;
	}
	.unlearn-btn {
		background: #d44;
		color: white;
		border: none;
		padding: 5px 15px;
		border-radius: 8px;
		cursor: pointer;
		font-family: var(--font-main);
		font-size: 14px;
	}
	.unlearn-btn:hover {
		background: #b33;
	}

	.tier-section {
		margin-bottom: 25px;
	}
	.tier-section.tier-locked {
		opacity: 0.4;
	}
	.tier-header {
		color: var(--primary-purple);
		font-family: var(--font-main);
		font-size: 18px;
		margin: 0 0 12px 0;
		border-bottom: 2px solid var(--border-color);
		padding-bottom: 6px;
	}
	.tier-req {
		font-size: 14px;
		color: #999;
		font-weight: normal;
	}

	.spells-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.spell-card {
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
	.spell-card:hover:not(:disabled) {
		transform: translateY(-3px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	.spell-card.selected {
		border-color: var(--heart-color);
		background: white;
		box-shadow:
			inset 0 0 0 2px var(--heart-color),
			0 0 12px rgba(139, 90, 150, 0.3);
	}
	.spell-card.unavailable {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.spell-title {
		font-family: var(--font-main);
		font-size: 15px;
		font-weight: bold;
		color: var(--primary-purple);
		margin-bottom: 4px;
	}
	.spell-circle {
		font-weight: normal;
		font-size: 14px;
		color: #888;
	}
	.spell-short {
		font-size: 14px;
		font-style: italic;
		color: #555;
		margin: 0 0 6px 0;
		line-height: 1.3;
	}
	.spell-stats {
		font-size: 14px;
		color: var(--primary-purple);
		font-weight: bold;
		margin: 0 0 6px 0;
	}
	.spell-desc {
		font-size: 14px;
		color: #444;
		margin: 0;
		line-height: 1.4;
	}

	@media (max-width: 768px) {
		.spells-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
