<script lang="ts">
	import { character } from '../store.svelte';
	import { ROLES, type RoleType } from '../data/roles';

	let { showModal = $bindable(false) } = $props();

	function selectRole(r: RoleType) {
		character.role = r;
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
				<h2>Select Your Role</h2>
				<button class="close-btn" onclick={() => (showModal = false)}>&times;</button>
			</div>

			<div class="roles-grid">
				{#each ROLES as role (role.name)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="role-card"
						class:selected={character.role === role.name}
						onclick={() => selectRole(role.name)}
					>
						<h3><span class="icon">{role.icon}</span> {role.name}</h3>
						<div class="role-desc">
							<p>{role.paragraphs[0].text}</p>
							<div class="role-details">
								<h4>{role.paragraphs[1].heading}</h4>
								<p>{role.paragraphs[1].text}</p>
								<h4>{role.paragraphs[2].heading}</h4>
								<p>{role.paragraphs[2].text}</p>
							</div>
						</div>
					</div>
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
	.roles-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 1fr 1fr;
		gap: 20px;
	}
	.role-card {
		background: var(--fill-color-light);
		border: 4px solid transparent;
		box-shadow: inset 0 0 0 2px var(--border-color);
		border-radius: 15px;
		padding: 15px;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s,
			background-color 0.2s,
			border-color 0.2s;
		display: flex;
		flex-direction: column;
	}
	.role-card:hover {
		transform: translateY(-4px);
		box-shadow:
			inset 0 0 0 2px var(--border-color),
			0 5px 15px rgba(0, 0, 0, 0.1);
	}
	.role-card.selected {
		border-color: var(--heart-color);
		background: white;
		box-shadow:
			inset 0 0 0 2px var(--heart-color),
			0 0 15px rgba(139, 90, 150, 0.4);
	}
	.role-card h3 {
		margin: 0 0 10px 0;
		color: var(--primary-purple);
		font-family: var(--font-main);
		font-size: 18px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.role-desc {
		font-size: 14px;
		color: #444;
		line-height: 1.4;
		font-family: var(--font-label);
		flex-grow: 1;
	}
	.role-details {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px dashed var(--border-color);
	}
	.role-details h4 {
		margin: 0 0 4px 0;
		color: var(--heart-color);
		font-family: var(--font-main);
		font-size: 14px;
	}
	.role-details p {
		margin: 0 0 10px 0;
	}
</style>
