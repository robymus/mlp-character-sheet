<script lang="ts">
    import { getCharacterContext } from '$lib/context';
    const character = getCharacterContext();
    import { INFLUENCES, type Influence } from '$lib/data/influences';

    function getInfluence(name: string): Influence | undefined {
        return INFLUENCES.find((inf) => inf.name === name);
    }

    function randomizeBond(index: number) {
        const influence = character.influences[index];
        if (!influence) return;
        const inf = getInfluence(influence);
        if (!inf || inf.backgroundBonds.length === 0) return;

        // Pick a random bond different from the current one if possible
        const current = character.backgroundBonds[index];
        const others = inf.backgroundBonds.filter((b) => b !== current);
        const pool = others.length > 0 ? others : inf.backgroundBonds;
        character.backgroundBonds[index] = pool[Math.floor(Math.random() * pool.length)];
    }
</script>

<div class="field-group-bubble bg-bonds-group">
    <div class="bubble-header-container">
        <h2 class="bubble-header">BACKGROUND BONDS</h2>
    </div>

    <div class="bonds-container">
        {#if character.influences.length === 0}
            <div class="empty-state">Select an Influence to gain a Background Bond.</div>
        {:else}
            {#each character.influences as influence, i (i)}
                {@const inf = influence ? getInfluence(influence) : null}
                {#if inf}
                    <div class="bond-item">
                        <span class="bond-label">{influence} Bond</span>
                        <div class="bond-textarea-wrapper">
                            <textarea
                                class="bond-text"
                                readonly
                                rows="3"
                                value={character.backgroundBonds[i] ||
                                    'Click the dice to randomize a bond.'}
                            ></textarea>
                            <button
                                class="dice-btn"
                                onclick={() => randomizeBond(i)}
                                title="Randomize bond">🎲</button
                            >
                        </div>
                    </div>
                {:else if influence}
                    <div class="bond-item">
                        <span class="bond-label">{influence} Bond</span>
                        <p class="bond-placeholder">Select this influence to see bonds.</p>
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</div>

<style>
    .bonds-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-top: 10px;
        height: 100%;
        min-height: 180px;
    }
    .empty-state {
        color: #888;
        font-style: italic;
        text-align: center;
        padding: 20px;
    }
    .bond-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .bond-label {
        font-size: 14px;
        color: var(--primary-purple);
        font-weight: bold;
        text-transform: uppercase;
    }
    .bond-textarea-wrapper {
        position: relative;
    }
    .bond-text {
        width: 100%;
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 8px;
        padding-right: 36px;
        font-family: var(--font-label);
        font-size: 14px;
        background: #fafafa;
        resize: none;
        color: #333;
        line-height: 1.4;
    }
    .dice-btn {
        position: absolute;
        bottom: 6px;
        right: 6px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 2px;
        line-height: 1;
        opacity: 0.6;
        transition:
            opacity 0.2s,
            transform 0.2s;
    }
    .dice-btn:hover {
        opacity: 1;
        transform: scale(1.2);
    }
    .bond-placeholder {
        font-size: 14px;
        color: #aaa;
        font-style: italic;
        margin: 0;
    }
</style>
