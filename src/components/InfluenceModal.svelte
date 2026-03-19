<script lang="ts">
	import { INFLUENCES, type Influence } from '../data/influences';

	let {
		showModal = $bindable(false),
		isSecondInfluence = false,
		currentInfluence = '',
		excludeInfluence = '',
		onselect,
	}: {
		showModal: boolean;
		isSecondInfluence?: boolean;
		currentInfluence?: string;
		excludeInfluence?: string;
		onselect: (influence: Influence) => void;
	} = $props();

	function selectInfluence(inf: Influence) {
		onselect(inf);
		showModal = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (showModal && e.key === 'Escape') showModal = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showModal}
	<div class="modal-backdrop" role="dialog">
		<div class="modal-content">
			<div class="modal-title-bar">
				<h2>
					{isSecondInfluence ? 'Select 2nd Influence' : 'Select Influence'}
				</h2>
				<button class="close-btn" onclick={() => (showModal = false)}>&times;</button>
			</div>

			{#if isSecondInfluence}
				<div class="warning-bar">A second influence comes with a mandatory Hang-Up.</div>
			{/if}

			<div class="influences-grid">
				{#each INFLUENCES as inf (inf.name)}
					{@const isExcluded = inf.name === excludeInfluence}
					{@const isSelected = inf.name === currentInfluence}
					<button
						class="influence-card"
						class:selected={isSelected}
						class:unavailable={isExcluded}
						disabled={isExcluded}
						onclick={() => selectInfluence(inf)}
					>
						<div class="inf-name">{inf.name}</div>
						<p class="inf-desc">{inf.description}</p>
						<div class="inf-perk">
							<strong>Perk:</strong>
							{inf.perkName} &mdash; {inf.perkDescription}
						</div>
						{#if isSecondInfluence}
							<div class="inf-hangup">
								<strong>Hang-Up:</strong>
								{inf.hangUpName} &mdash; {inf.hangUpDescription}
							</div>
						{/if}
						<p class="inf-chars">{inf.suggestedCharacteristics}</p>
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
	.warning-bar {
		text-align: center;
		padding: 8px 16px;
		margin-bottom: 20px;
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 10px;
		font-family: var(--font-label);
		font-size: 14px;
		color: #856404;
	}
	.influences-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.influence-card {
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
	.influence-card:hover:not(:disabled) {
		transform: translateY(-3px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	.influence-card.selected {
		border-color: var(--heart-color);
		background: white;
		box-shadow:
			inset 0 0 0 2px var(--heart-color),
			0 0 12px rgba(139, 90, 150, 0.3);
	}
	.influence-card.unavailable {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.inf-name {
		font-family: var(--font-main);
		font-size: 15px;
		font-weight: bold;
		color: var(--primary-purple);
		margin-bottom: 6px;
	}
	.inf-desc {
		font-size: 14px;
		color: #444;
		margin: 0 0 8px 0;
		line-height: 1.4;
	}
	.inf-perk {
		font-size: 14px;
		color: #333;
		margin-bottom: 6px;
		line-height: 1.3;
	}
	.inf-hangup {
		font-size: 14px;
		color: #a33;
		margin-bottom: 6px;
		line-height: 1.3;
	}
	.inf-chars {
		font-size: 14px;
		color: #888;
		font-style: italic;
		margin: 0;
		line-height: 1.3;
		margin-top: auto;
	}

</style>
