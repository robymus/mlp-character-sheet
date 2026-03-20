<script lang="ts">
    import { getCharacterContext } from '$lib/context';
    const character = getCharacterContext();
    import { INFLUENCES, type Influence } from '$lib/data/influences';
    import InfluenceModal from './InfluenceModal.svelte';

    let showModal = $state(false);
    let editingIndex = $state(0);

    function getInfluence(name: string): Influence | undefined {
        return INFLUENCES.find((inf) => inf.name === name);
    }

    function openSelector(index: number) {
        editingIndex = index;
        showModal = true;
    }

    function handleSelect(inf: Influence) {
        if (editingIndex === 0 && character.influences.length === 0) {
            character.influences = [inf.name];
            // Pick a random background bond
            const randomBond =
                inf.backgroundBonds[Math.floor(Math.random() * inf.backgroundBonds.length)];
            character.backgroundBonds = [randomBond];
        } else {
            character.influences[editingIndex] = inf.name;
            // Pick a random background bond for this slot
            const randomBond =
                inf.backgroundBonds[Math.floor(Math.random() * inf.backgroundBonds.length)];
            character.backgroundBonds[editingIndex] = randomBond;
        }

        // If selecting the 2nd influence, auto-set the hang-up
        if (editingIndex === 1) {
            character.hangup = `${inf.hangUpName}: ${inf.hangUpDescription}`;
        }
    }

    function handleAddSecondInfluence() {
        character.influences = [character.influences[0], ''];
        character.backgroundBonds = [character.backgroundBonds[0] || '', ''];
        openSelector(1);
    }

    function handleRemoveInfluence(index: number) {
        if (index === 0 && character.influences.length === 2) {
            // Removing first: shift second to first, clear hang-up
            character.influences = [character.influences[1]];
            character.backgroundBonds = [character.backgroundBonds[1] || ''];
        } else {
            character.influences = character.influences.filter((_, i) => i !== index);
            character.backgroundBonds = character.backgroundBonds.filter((_, i) => i !== index);
        }
        character.hangup = '';
    }
</script>

<InfluenceModal
    bind:showModal
    isSecondInfluence={editingIndex === 1}
    currentInfluence={character.influences[editingIndex] || ''}
    excludeInfluence={editingIndex === 1
        ? character.influences[0] || ''
        : character.influences[1] || ''}
    onselect={handleSelect}
/>

<div class="traits-left">
    <div class="field-group influences-group">
        <div class="influences-container">
            {#if character.influences.length === 0}
                <button class="influence-btn empty" onclick={() => openSelector(0)}>
                    Select Influence...
                </button>
            {/if}

            {#each character.influences as influence, i (i)}
                {@const inf = influence ? getInfluence(influence) : null}
                <div class="influence-row">
                    <button
                        class="influence-btn"
                        class:empty={!influence}
                        onclick={() => openSelector(i)}
                    >
                        {influence || `Select Influence ${i + 1}...`}
                    </button>
                    {#if influence}
                        <button
                            class="remove-btn"
                            onclick={() => handleRemoveInfluence(i)}
                            title="Remove influence">&times;</button
                        >
                    {/if}
                </div>
                {#if inf}
                    <div class="influence-detail">
                        <span class="inf-perk-label">Perk: {inf.perkName}</span>
                        <span class="inf-skill-label">Skill: {inf.influenceSkill}</span>
                    </div>
                {/if}
            {/each}

            {#if character.influences.length === 1 && character.influences[0]}
                <button class="add-btn" onclick={handleAddSecondInfluence}>
                    + Add 2nd Influence (with Hang-Up)
                </button>
            {/if}
        </div>
        <span class="field-label">INFLUENCES</span>
    </div>

    <div class="field-group hangups-group">
        <div class="hangup-container">
            {#if character.influences.length > 1 && character.hangup}
                <p class="hangup-text">{character.hangup}</p>
            {:else if character.influences.length > 1}
                <p class="hangup-empty">Hang-Up will be set from your 2nd influence.</p>
            {:else}
                <p class="hangup-empty">Take a 2nd influence to get a Hang-Up.</p>
            {/if}
        </div>
        <span class="field-label">HANG-UPS</span>
    </div>
</div>

<style>
    .traits-left {
        display: flex;
        flex-direction: column;
        gap: 15px;
        height: 100%;
    }
    .influences-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex-grow: 1;
        border: 2px solid var(--border-color);
        border-radius: 15px;
        padding: 8px 12px;
    }
    .influence-row {
        display: flex;
        gap: 5px;
        align-items: center;
    }
    .influence-btn {
        flex-grow: 1;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        padding: 6px 10px;
        font-size: 14px;
        font-family: var(--font-label);
        background: white;
        cursor: pointer;
        text-align: left;
        color: var(--primary-purple);
        font-weight: bold;
    }
    .influence-btn.empty {
        color: #888;
        font-weight: normal;
        border-style: dashed;
    }
    .influence-btn:hover {
        background: var(--fill-color-light);
    }
    .influence-detail {
        display: flex;
        gap: 10px;
        padding: 0 4px;
        font-size: 14px;
        font-family: var(--font-label);
    }
    .inf-perk-label {
        color: #555;
    }
    .inf-skill-label {
        color: #888;
        margin-left: auto;
    }
    .add-btn {
        background: none;
        border: 1px dashed var(--border-color);
        border-radius: 5px;
        color: var(--primary-purple);
        cursor: pointer;
        padding: 4px;
        font-size: 14px;
        margin-top: auto;
    }
    .add-btn:hover {
        background: var(--fill-color-light);
    }
    .remove-btn {
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
    }
    .hangup-container {
        border: 2px solid var(--border-color);
        border-radius: 15px;
        padding: 8px 12px;
        flex-grow: 1;
        min-height: 60px;
    }
    .hangup-text {
        margin: 0;
        font-size: 14px;
        font-family: var(--font-label);
        color: #a33;
        line-height: 1.4;
    }
    .hangup-empty {
        margin: 0;
        font-size: 14px;
        font-family: var(--font-label);
        color: #aaa;
        font-style: italic;
    }
</style>
