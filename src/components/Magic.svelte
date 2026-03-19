<script lang="ts">
	import { character } from '../store.svelte';
	import { SPELLS, type SpellTier } from '../data/spells';
	import SpellSelectorModal from './SpellSelectorModal.svelte';

	let isMagical = $derived(character.isMagical);

	let currentRank = $derived(character.magicRank);
	let availableMagicPoints = $derived(character.availableMagicPoints);

	let showSpellModal = $state(false);
	let editingSlot = $state(0);

	function handleRankClick(rank: number) {
		if (!isMagical) return;
		if (rank === currentRank) {
			character.magicRank = rank - 1;
		} else if (rank > currentRank) {
			const cost = rank - currentRank;
			if (rank <= character.essenceSma && availableMagicPoints >= cost) {
				character.magicRank = rank;
			}
		} else {
			character.magicRank = rank;
		}
	}

	function getSpellcastingWarning(rank: number): string {
		if (rank <= currentRank) return '';
		if (rank > character.essenceSma) return `Requires Smarts Essence ${rank}+`;
		const cost = rank - currentRank;
		if (availableMagicPoints < cost)
			return `Not enough Skill Points. Need ${cost}, have ${availableMagicPoints}.`;
		return '';
	}

	function openSpellSelector(slotIndex: number) {
		editingSlot = slotIndex;
		showSpellModal = true;
	}

	function getSpellByName(name: string) {
		return SPELLS.find((s) => s.name === name);
	}

	/** What tiers a slot can hold based on its position */
	function availableTiersForSlot(slotIndex: number): SpellTier[] {
		if (slotIndex >= 4) return ['Elementary', 'Superior', 'Virtuoso'];
		if (slotIndex >= 2) return ['Elementary', 'Superior'];
		return ['Elementary'];
	}

	function getSlotLabel(slotIndex: number): string {
		if (slotIndex >= currentRank) {
			const dieLabels = ['D2', 'D4', 'D6', 'D8', 'D10', 'D12', '2D8', '3D6'];
			return `Requires Spellcasting ${dieLabels[slotIndex] || '??'}`;
		}
		const tiers = availableTiersForSlot(slotIndex);
		if (tiers.length === 1) return 'Learn an Elementary spell';
		if (tiers.length === 2) return 'Learn an Elementary or Superior spell';
		return 'Learn an Elementary, Superior, or Virtuoso spell';
	}

	/** Check if a spell in a slot is still valid */
	function isSlotValid(slotIndex: number): boolean {
		if (slotIndex >= currentRank) return false;
		const spellName = character.masteredSpells[slotIndex];
		if (!spellName) return true;
		const spell = getSpellByName(spellName);
		if (!spell) return true;
		return availableTiersForSlot(slotIndex).includes(spell.tier);
	}

	const SPELL_SLOT_COUNT = 6;
	const SLOT_INDICES = [0, 1, 2, 3, 4, 5];
	const PLACEHOLDER_INDICES = [6, 7];
</script>

<SpellSelectorModal bind:showModal={showSpellModal} slotIndex={editingSlot} />

<div class="magic-attack-wrapper" class:disabled-section={!isMagical}>
	<div class="magic-section">
		<div class="stat-header magic-header">
			<h2>MAGIC</h2>
		</div>

		{#if isMagical}
			<div class="magic-points-bubble" class:empty={availableMagicPoints <= 0}>
				<span class="mp-num">{availableMagicPoints}</span>
				<span class="mp-label">SP available</span>
			</div>
		{/if}

		<div class="magic-content">
			<div class="spellcasting-left">
				<div class="spellcasting-title-row">
					<h3>SPELLCASTING</h3>
					<div class="spell-dice-container">
						{#each ['D2', 'D4', 'D6', 'D8', 'D10', 'D12'] as label, index (label)}
							{@const rank = index + 1}
							{@const checked = currentRank >= rank}
							{@const warning = getSpellcastingWarning(rank)}
							{@const disabled = warning !== ''}
							<div class="dice-col">
								<span>{label}</span>
								<div
									class="custom-checkbox"
									class:checked
									class:disabled
									title={warning || label}
									onclick={() => handleRankClick(rank)}
									role="button"
									tabindex="0"
									onkeydown={(e) => e.key === 'Enter' && handleRankClick(rank)}
								></div>
							</div>
						{/each}
					</div>
				</div>
				{#if isMagical && character.essenceSma === 0}
					<p class="smarts-hint">Allocate Smarts Essence to unlock Spellcasting ranks.</p>
				{/if}

				<div class="spell-list">
					<div class="spell-header-row">
						<span class="sub-label">MASTERED SPELLS</span>
						<span class="col-head col-tier">TIER</span>
						<span class="col-head col-circle">CIRCLE</span>
					</div>
					{#each SLOT_INDICES as i (i)}
						{@const spellName = character.masteredSpells[i]}
						{@const spell = spellName ? getSpellByName(spellName) : null}
						{@const slotUnlocked = i < currentRank && i < SPELL_SLOT_COUNT}
						{@const valid = isSlotValid(i)}
						<div
							class="spell-slot"
							class:slot-locked={!slotUnlocked}
							class:slot-invalid={!valid && !!spellName}
						>
							{#if !slotUnlocked && !spellName}
								<div class="slot-content slot-placeholder">
									<span class="slot-requires">{getSlotLabel(i)}</span>
								</div>
							{:else if !slotUnlocked && spellName}
								<div class="slot-content slot-placeholder">
									<span class="slot-requires">{getSlotLabel(i)}</span>
								</div>
							{:else if slotUnlocked && !spell}
								<button class="slot-content slot-empty" onclick={() => openSpellSelector(i)}>
									<span class="slot-learn">{getSlotLabel(i)}</span>
								</button>
							{:else if spell}
								<div class="slot-content slot-filled">
									<div class="spell-summary">
										<strong>{spell.name}</strong> – {spell.shortDescription}
										<span class="spell-summary-stats">({spell.stats})</span>
									</div>
									<button
										class="edit-spell-btn"
										onclick={() => openSpellSelector(i)}
										title="Change spell">✏️</button
									>
								</div>
							{/if}
							<div class="slot-tier">
								{#if spell && slotUnlocked}{spell.tier}{/if}
							</div>
							<div class="slot-circle">
								{#if spell && slotUnlocked}{spell.circle}{/if}
							</div>
						</div>
					{/each}
					<!-- Empty placeholder rows for visual parity -->
					{#each PLACEHOLDER_INDICES as j (j)}
						<div class="spell-slot slot-locked">
							<div class="slot-content slot-placeholder"></div>
							<div class="slot-tier"></div>
							<div class="slot-circle"></div>
						</div>
					{/each}
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
	.custom-checkbox.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.active-rank {
		background-color: var(--primary-purple);
		color: white;
		font-weight: bold;
	}
	.magic-points-bubble {
		position: absolute;
		top: 6px;
		right: 12px;
		background: var(--primary-purple);
		color: white;
		border-radius: 10px;
		padding: 4px 10px;
		display: flex;
		align-items: center;
		gap: 5px;
		font-family: var(--font-main);
		z-index: 10;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}
	.magic-points-bubble.empty {
		background: #888;
		opacity: 0.6;
	}
	.mp-num {
		font-size: 16px;
		font-weight: bold;
	}
	.mp-label {
		font-size: 14px;
	}
	.smarts-hint {
		margin: 4px 0 8px;
		font-size: 13px;
		color: #c33;
		font-style: italic;
		font-family: var(--font-label);
	}

	/* Spell slots */
	.spell-slot {
		display: flex;
		align-items: stretch;
		gap: 6px;
		min-height: 28px;
		margin-bottom: 4px;
	}
	.slot-content {
		flex-grow: 1;
		display: flex;
		align-items: center;
		border-radius: 8px;
		padding: 3px 8px;
		font-size: 14px;
		font-family: var(--font-label);
		min-height: 26px;
	}
	.slot-placeholder {
		background: #f5f5f5;
		border: 1px dashed #ccc;
	}
	.slot-requires {
		color: #aaa;
		font-style: italic;
	}
	.slot-empty {
		background: white;
		border: 1px dashed var(--primary-purple);
		cursor: pointer;
		text-align: left;
	}
	.slot-empty:hover {
		background: var(--fill-color-light);
	}
	.slot-learn {
		color: var(--primary-purple);
	}
	.slot-filled {
		background: white;
		border: 1px solid var(--border-color);
		gap: 6px;
	}
	.spell-summary {
		flex-grow: 1;
		font-size: 14px;
		line-height: 1.3;
		color: #333;
	}
	.spell-summary strong {
		color: var(--primary-purple);
	}
	.spell-summary-stats {
		color: #888;
		font-size: 14px;
	}
	.edit-spell-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 14px;
		padding: 0 4px;
		flex-shrink: 0;
		opacity: 0.6;
	}
	.edit-spell-btn:hover {
		opacity: 1;
	}
	.slot-tier,
	.slot-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-family: var(--font-label);
		color: #666;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 2px 4px;
		background: white;
	}
	.slot-tier {
		width: 90px;
		flex-shrink: 0;
	}
	.slot-circle {
		width: 100px;
		flex-shrink: 0;
	}
	.slot-locked {
		opacity: 0.5;
	}
	.slot-invalid .slot-filled {
		border-color: #d44;
		background: #fff5f5;
	}
</style>
