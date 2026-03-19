<script lang="ts">
	import { character, type Origin } from '../store.svelte';

	let { showModal = $bindable(false) } = $props();

	let localOrigin = $state<Origin>(character.origin);
	let localDiamond = $state(character.diamondEssence);
	let localGold = $state(character.goldEssence);

	$effect(() => {
		if (showModal) {
			localOrigin = character.origin;
			localDiamond = character.diamondEssence;
			localGold = character.goldEssence;
		}
	});

	let isValid = $derived(
		localOrigin !== '' && localDiamond !== '' && localGold !== '' && localDiamond !== localGold,
	);

	type EssenceType = 'strength' | 'speed' | 'smarts' | 'social' | '';

	function updateDiamond(val: EssenceType) {
		if (val === localGold) localGold = localDiamond;
		localDiamond = val;
	}

	function updateGold(val: EssenceType) {
		if (val === localDiamond) localDiamond = localGold;
		localGold = val;
	}

	function confirm() {
		if (isValid) {
			character.resetAllocations();
			character.origin = localOrigin;
			character.diamondEssence = localDiamond;
			character.goldEssence = localGold;
			if (localOrigin === 'Earth Pony') character.movement = '🐎 45ft';
			else if (localOrigin === 'Unicorn') character.movement = '🐎 30ft';
			else if (localOrigin === 'Pegasus') character.movement = '🐎 30ft / 🪽 30ft';
			showModal = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (showModal && e.key === 'Escape') showModal = false;
	}

	function selectOrigin(o: Origin) {
		localOrigin = o;
		if (o === 'Earth Pony') {
			localDiamond = 'strength';
			localGold = 'social';
		} else if (o === 'Pegasus') {
			localDiamond = 'speed';
			localGold = 'strength';
		} else if (o === 'Unicorn') {
			localDiamond = 'smarts';
			localGold = 'social';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showModal}
	<div class="modal-backdrop" role="dialog">
		<div class="modal-content">
			<div class="modal-title-bar">
				<h2>Select Your Origin & Essences</h2>
				<button class="close-btn" onclick={() => (showModal = false)}>&times;</button>
			</div>

			<div class="origins-grid">
				<!-- Earth Pony -->
				<button
					class="origin-card"
					class:selected={localOrigin === 'Earth Pony'}
					onclick={() => selectOrigin('Earth Pony')}
				>
					<img src="origins/earth_pony.png" alt="Earth Pony" />
					<h3>Earth Pony</h3>
					<p>
						Earth Ponies are naturally resilient and deeply connected to the land. They gain an
						extra general perk (like an Animal Pet) to represent their broader capabilities.
					</p>
				</button>

				<!-- Pegasus -->
				<button
					class="origin-card"
					class:selected={localOrigin === 'Pegasus'}
					onclick={() => selectOrigin('Pegasus')}
				>
					<img src="origins/pegasus.png" alt="Pegasus" />
					<h3>Pegasus</h3>
					<p>
						Pegasi have the unique ability to fly and walk on clouds. They are naturally agile and
						masters of the sky.
					</p>
				</button>

				<!-- Unicorn -->
				<button
					class="origin-card"
					class:selected={localOrigin === 'Unicorn'}
					onclick={() => selectOrigin('Unicorn')}
				>
					<img src="origins/unicorn.png" alt="Unicorn" />
					<h3>Unicorn</h3>
					<p>
						Unicorns possess a horn that allows them to channel magic. They can move objects with
						telekinesis and master complex spells.
					</p>
				</button>
			</div>

			<div class="options-container">
				<div class="options-grid">
					<div class="essence-selector">
						<label for="diamond-essence"
							>Diamond Essence (+2)<br /><small>Your fastest growing essence</small></label
						>
						<select
							id="diamond-essence"
							value={localDiamond}
							onchange={(e) => updateDiamond(e.currentTarget.value as EssenceType)}
						>
							<option value="strength">Strength</option>
							<option value="speed">Speed</option>
							<option value="smarts">Smarts</option>
							<option value="social">Social</option>
						</select>
					</div>

					<div class="essence-selector">
						<label for="gold-essence"
							>Gold Essence (+1)<br /><small>Your second fastest growing essence</small></label
						>
						<select
							id="gold-essence"
							value={localGold}
							onchange={(e) => updateGold(e.currentTarget.value as EssenceType)}
						>
							<option value="strength">Strength</option>
							<option value="speed">Speed</option>
							<option value="smarts">Smarts</option>
							<option value="social">Social</option>
						</select>
					</div>
				</div>
			</div>

			<div class="modal-actions">
				<button class="confirm-btn" disabled={!isValid} onclick={confirm}>Confirm Origin</button>
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
		max-width: 900px;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
	}
	.modal-title-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-bottom: 30px;
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
	.origins-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-bottom: 30px;
	}
	.origin-card {
		background: var(--fill-color-light);
		border: 2px solid var(--border-color);
		border-radius: 15px;
		padding: 15px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.origin-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}
	.origin-card.selected {
		border-color: var(--heart-color);
		background: white;
		box-shadow:
			inset 0 0 0 2px var(--heart-color),
			0 0 15px rgba(139, 90, 150, 0.4);
	}
	.origin-card img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 10px;
		margin-bottom: 10px;
		border: 1px solid var(--border-color);
	}
	.origin-card h3 {
		margin: 10px 0 5px;
		color: var(--primary-purple);
		font-family: var(--font-main);
		font-size: 20px;
	}
	.origin-card p {
		font-size: 14px;
		color: #444;
		line-height: 1.4;
		font-family: var(--font-label);
	}

	.options-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30px;
	}
	.options-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 30px;
		column-gap: 40px;
		width: 100%;
	}
	.essence-selector {
		display: flex;
		flex-direction: column;
		gap: 10px;
		text-align: center;
		width: 100%;
	}
	.essence-selector label {
		font-size: 16px;
		font-family: var(--font-main);
		color: var(--primary-purple);
		font-weight: bold;
	}
	.essence-selector small {
		font-size: 14px;
		color: #666;
		text-transform: none;
		font-weight: normal;
	}
	.essence-selector select {
		width: 100%;
		padding: 10px;
		border-radius: 10px;
		border: 2px solid var(--border-color);
		font-family: var(--font-label);
		font-size: 16px;
		background-color: white;
	}
	.modal-actions {
		display: flex;
		justify-content: center;
		margin-top: 0;
	}
	.confirm-btn {
		background: var(--primary-purple);
		color: white;
		border: none;
		padding: 15px 40px;
		font-size: 18px;
		border-radius: 30px;
		cursor: pointer;
		font-family: var(--font-main);
		font-weight: bold;
		transition: all 0.2s;
	}
	.confirm-btn:hover:not(:disabled) {
		background: var(--heart-color);
		transform: scale(1.05);
	}
	.confirm-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
</style>
