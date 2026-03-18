<script lang="ts">
	import { character } from '../store.svelte';
	import { GENERAL_PERKS, type GeneralPerk } from '../data/generalPerks';
	import { INFLUENCES, type Influence } from '../data/influences';
	import GeneralPerkModal from './GeneralPerkModal.svelte';

	let showPerkModal = $state(false);

	function getInfluence(name: string): Influence | undefined {
		return INFLUENCES.find((inf) => inf.name === name);
	}

	function getPerk(name: string): GeneralPerk | undefined {
		return GENERAL_PERKS.find((p) => p.name === name);
	}

	/** Check if prerequisite is met for a general perk */
	function checkPrerequisite(perk: GeneralPerk): { met: boolean; reason: string } {
		if (!perk.prerequisite) return { met: true, reason: '' };

		if (perk.prerequisite.essence) {
			for (const [ess, minVal] of Object.entries(perk.prerequisite.essence)) {
				const current = character.essenceValue(ess as 'strength' | 'speed' | 'smarts' | 'social');
				if (current < minVal!) {
					const label = ess.charAt(0).toUpperCase() + ess.slice(1);
					return { met: false, reason: `Requires ${label} ${minVal}` };
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

	/** Earth Pony gets 1 general perk slot */
	let hasGeneralPerkSlot = $derived(character.origin === 'Earth Pony');

	function handlePerkSelect(perk: GeneralPerk) {
		character.generalPerks = [...character.generalPerks, perk.name];
	}

	function removeGeneralPerk(index: number) {
		const perkName = character.generalPerks[index];
		// If removing Magical, reset magic allocations
		if (perkName === 'Magical') {
			character.magicRank = 0;
			character.masteredSpells = Array(8).fill('');
		}
		character.generalPerks = character.generalPerks.filter((_, i) => i !== index);
		// Clean up choice
		const remaining = character.generalPerks.filter((p) => p === perkName);
		if (remaining.length === 0) {
			delete character.generalPerkChoices[perkName];
		}
	}

	function setChoice(perkName: string, value: string) {
		character.generalPerkChoices[perkName] = value;
	}
</script>

<GeneralPerkModal bind:showModal={showPerkModal} onselect={handlePerkSelect} />

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
					<span class="perk-name">Earth Pony Resilience</span>
					<p class="perk-desc">
						Your deep connection to the land grants you +1 to
						<select
							bind:value={character.earthPonyEssence}
							style="padding: 2px; border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-label); background: white;"
						>
							<option value="strength">Strength</option>
							<option value="social">Social</option>
						</select>
						Essence.
					</p>
				</div>
				<div class="perk-item read-only origin-box">
					<span class="perk-name">Adaptable</span>
					<p class="perk-desc">
						Once per scene, when using a Skill from
						<select
							bind:value={character.adaptableEssence}
							style="padding: 2px; border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-label); background: white;"
						>
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
						<select
							bind:value={character.movement}
							style="padding: 2px; border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-label); background: white;"
						>
							<option value="🐎 15ft / 🪽 45ft">🐎 15ft Ground / 🪽 45ft Air</option>
							<option value="🐎 30ft / 🪽 30ft">🐎 30ft Ground / 🪽 30ft Air</option>
							<option value="🐎 45ft / 🪽 15ft">🐎 45ft Ground / 🪽 15ft Air</option>
						</select>
					</p>
				</div>
				<div class="perk-item read-only origin-box">
					<span class="perk-name">Lighter Than Air</span>
					<p class="perk-desc">
						Aerial acrobatics are in your hollow bones. You get ↑1 on Acrobatics Skill Tests. You
						can land on clouds and walk around Pegasus sky cities.
					</p>
				</div>
			{:else if character.origin === 'Unicorn'}
				<div class="perk-item read-only origin-box">
					<span class="perk-name">Telekinesis</span>
					<p class="perk-desc">
						Unicorns learn to use their telekinetic abilities to manipulate objects at a distance,
						which makes their horn glow with magical power.
					</p>
				</div>
			{:else}
				<p class="empty-state">Select an Origin to see Origin Perks.</p>
			{/if}
		</div>

		{#if character.influences.length > 0}
			<div class="perk-section">
				<span class="perk-label">Influence Perks:</span>
				{#each character.influences as influenceName (influenceName)}
					{@const inf = influenceName ? getInfluence(influenceName) : null}
					{#if inf}
						<div class="perk-item read-only influence-box">
							<span class="perk-name">{inf.perkName}</span>
							<p class="perk-desc">
								<strong>{inf.name}:</strong>
								{inf.perkDescription}
								{#if inf.perkChoices}
									<br />
									<em>Choose:</em>
									<select class="inline-select">
										{#each inf.perkChoices as choice (choice)}
											<option value={choice}>{choice}</option>
										{/each}
									</select>
								{/if}
							</p>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		<div class="perk-section">
			<span class="perk-label">General Perks:</span>

			{#if character.origin === 'Unicorn'}
				<!-- Unicorns auto-get Magical -->
				<div class="perk-item added-perk-box">
					<span class="perk-name">Magical</span>
					<p class="perk-desc">
						You are a magical pony capable of casting spells. Unlocks the Spellcasting skill and
						spell slots.
					</p>
				</div>
			{:else if hasGeneralPerkSlot}
				<!-- Earth Pony gets to pick 1 general perk -->
				{#if character.generalPerks.length === 0}
					<button class="perk-select-btn" onclick={() => (showPerkModal = true)}>
						Select General Perk...
					</button>
				{/if}

				{#each character.generalPerks as perkName, i (perkName + '-' + i)}
					{@const perk = getPerk(perkName)}
					{@const prereqCheck = perk ? checkPrerequisite(perk) : { met: true, reason: '' }}
					{#if perk}
						<div class="perk-item added-perk-box" class:prereq-warning={!prereqCheck.met}>
							<div class="perk-item-header">
								<span class="perk-name">
									{#if !prereqCheck.met}
										<span class="warning-icon" title={prereqCheck.reason}>⚠️</span>
									{/if}
									{perk.name}
								</span>
								<button class="remove-btn" onclick={() => removeGeneralPerk(i)}>&times;</button>
							</div>
							<p class="perk-desc">
								{perk.shortDescription}
								{#if perk.note}
									<br /><strong class="alert-note">{perk.note}</strong>
								{/if}
							</p>
							{#if !prereqCheck.met}
								<p class="prereq-reason">{prereqCheck.reason}</p>
							{/if}
							{#if perk.choices}
								<div class="perk-choice">
									<label class="choice-label">{perk.choiceLabel || 'Choose:'}</label>
									<select
										class="inline-select"
										value={character.generalPerkChoices[perk.name] || ''}
										onchange={(e) => setChoice(perk.name, e.currentTarget.value)}
									>
										<option value="">Select...</option>
										{#each perk.choices as choice (choice)}
											<option value={choice}>{choice}</option>
										{/each}
									</select>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			{:else if character.origin === 'Pegasus'}
				<p class="empty-state">Pegasus origin does not grant a General Perk.</p>
			{:else}
				<p class="empty-state">Select an Origin to see General Perks.</p>
			{/if}
		</div>

		{#if character.role}
			{@const roleName = character.role.replace('Spirit of ', '')}
			<div class="perk-section" style="margin-top: 15px;">
				<span class="perk-label">Role Perks:</span>

				<div class="perk-item read-only">
					<span class="perk-name">A Talent for {roleName}</span>
					<p class="perk-desc">
						You can perform actions related to {roleName} more easily than most ponies.
					</p>
				</div>

				<div class="perk-item read-only">
					<span class="perk-name">{roleName} is Magic</span>
					<p class="perk-desc">
						Once per scene, when you act in the spirit of {roleName}, you gain a Friendship Point.
					</p>
				</div>

				<div class="perk-item read-only">
					<span class="perk-name">Friendship Circle</span>
					<p class="perk-desc">
						Once per scene, a pony in your group can spend a Friendship Point as a Standard action
						to form a Friendship Circle.
					</p>
				</div>

				{#if roleName === 'Generosity'}
					<div class="perk-item read-only">
						<span class="perk-name">Generosity of Spirit</span>
						<p class="perk-desc">
							You can grant another player character ↑1 to any Skill Test before they roll the dice.
							You suffer ↓1 on your next Skill Test.
						</p>
					</div>
				{:else if roleName === 'Honesty'}
					<div class="perk-item read-only">
						<span class="perk-name">Speak Your Truth</span>
						<p class="perk-desc">
							Ponies tend to focus on your words and not your tone or theatrics. When you increase
							<select bind:value={character.honestyEssence} class="inline-select">
								<option value="strength">Strength</option>
								<option value="speed">Speed</option>
								<option value="smarts">Smarts</option>
							</select>
							, you can spend the skill point on Persuasion.
						</p>
					</div>
				{:else if roleName === 'Kindness'}
					<div class="perk-item read-only">
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
					<div class="perk-item read-only">
						<span class="perk-name">Cheer</span>
						<p class="perk-desc">
							You live to spread cheer, but tapping into your own cheer reserves can take a lot out
							of you. You have 2 Cheer Points. Cheer Points can be used as a Free Action to reroll a
							failed Performance Skill Test.
						</p>
					</div>
				{:else if roleName === 'Loyalty'}
					<div class="perk-item read-only">
						<span class="perk-name">Reactionary</span>
						<p class="perk-desc">
							You're quick to Spring into Action. You get ↑1 on Initiative. If you're not first in
							Initiative order, you can roll a new Initiative once per round.
						</p>
					</div>
				{:else if roleName === 'Magic'}
					<div class="perk-item read-only">
						<span class="perk-name">Mystical Understanding</span>
						<p class="perk-desc">
							You understand the magic of the universe, and can use it when you need it. You have 2
							Mystical Points to spend on: Essential Research, Magically Fit In, Refocus,
							Spellcosting, Spellcialize.
						</p>
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
		font-size: 14px;
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
	.influence-box {
		border-color: #5b9bd5;
		background: #f0f7ff !important;
	}
	.added-perk-box {
		border-color: #793d87;
		background: #fdf5ff !important;
		margin-top: 5px;
	}
	.added-perk-box.prereq-warning {
		border-color: #d44;
		background: #fff5f5 !important;
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
		font-size: 14px;
		color: #444;
	}
	.italic-note {
		font-style: italic;
		color: #888;
	}
	.alert-note {
		color: #e74c3c;
	}
	.perk-select-btn {
		width: 100%;
		padding: 8px;
		border-radius: 8px;
		border: 1px dashed var(--border-color);
		font-family: var(--font-label);
		font-size: 14px;
		background: white;
		color: var(--primary-purple);
		cursor: pointer;
		text-align: left;
	}
	.perk-select-btn:hover {
		background: var(--fill-color-light);
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
		font-size: 14px;
		color: #888;
		font-style: italic;
	}
	.warning-icon {
		margin-right: 4px;
	}
	.prereq-reason {
		margin: 4px 0 0;
		font-size: 13px;
		color: #d44;
		font-style: italic;
	}
	.perk-choice {
		margin-top: 5px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.choice-label {
		font-size: 13px;
		color: #666;
		font-style: italic;
		text-transform: none;
		margin-top: 0;
		background: none;
		padding: 0;
	}
</style>
