<script lang="ts">
    import { getCharacterContext } from '$lib/context';
    const character = getCharacterContext();
    import type { EssenceType } from '$lib/store.svelte';
    import Tooltip from './Tooltip.svelte';

    let {
        type,
        title,
        defenseName,
        value = $bindable(0),
        computedValue,
        children,
    }: {
        type: EssenceType;
        title: string;
        defenseName: string;
        value: number;
        computedValue: number;
        children: import('svelte').Snippet;
    } = $props();

    function increment() {
        if (character.availableEssencePoints > 0) {
            value++;
        }
    }

    function decrement() {
        if (value > 1 && character.canDecrementEssence(type)) {
            value--;
        }
    }

    let canDecrement = $derived(value > 1 && character.canDecrementEssence(type));
    let isDiamond = $derived(character.diamondEssence === type);
    let isGold = $derived(character.goldEssence === type);
    let isOriginBonus = $derived(
        (character.origin === 'Earth Pony' && character.earthPonyEssence === type) ||
            (character.origin === 'Pegasus' && type === 'speed') ||
            (character.origin === 'Unicorn' && type === 'smarts'),
    );
    let skillPointsAvailable = $derived(character.spendableSkillPointsIn(type));
</script>

<div class={`stat-column ${type}`}>
    <div class="boost-labels">
        {#if isDiamond}
            <div class="essence-boost-label">Diamond Essence (+2) 💎</div>
        {:else if isGold}
            <div class="essence-boost-label">Gold Essence (+1) ⭐</div>
        {/if}
        {#if isOriginBonus}
            <div class="essence-boost-label origin-boost">Origin Bonus (+1) 🐴</div>
        {/if}
    </div>
    <div class="stat-header">
        <div class="header-content">
            <h2>
                {title}
                <div class="essence-controls">
                    <Tooltip
                        disabled={canDecrement}
                        content="Cannot decrease: skill points already allocated."
                    >
                        <button class="essence-btn" onclick={decrement} disabled={!canDecrement}
                            >-</button
                        >
                    </Tooltip>

                    <Tooltip
                        disabled={true}
                        content={`Base Essence: ${value} | Origin Bonus: ${computedValue - value}`}
                    >
                        <input type="number" class="stat-input" readonly value={computedValue} />
                    </Tooltip>

                    <Tooltip
                        disabled={character.availableEssencePoints <= 0}
                        content="Not enough Essence points available."
                    >
                        <button
                            class="essence-btn"
                            onclick={increment}
                            disabled={character.availableEssencePoints <= 0}>+</button
                        >
                    </Tooltip>
                </div>
            </h2>
        </div>
    </div>

    <div class="skill-points-bubble" class:empty={skillPointsAvailable <= 0}>
        <span class="sp-num">{skillPointsAvailable}</span>
        <span class="sp-label">SP</span>
    </div>

    <div class="derived-stat">
        <div class="derived-header">
            <label for={`${type}-defense`}>{defenseName}</label>
            <input
                type="number"
                id={`${type}-defense`}
                class="derived-box"
                readonly
                value={10 + computedValue}
            />
        </div>
        <div class="derived-formula">
            <span>10 +</span>
            <div class="formula-box">
                <input type="number" id={`${type}-ess`} readonly value={computedValue} /><label
                    for={`${type}-ess`}>ESSENCE</label
                >
            </div>
            <span>+</span>
            <div class="formula-box">
                <input type="number" id={`${type}-prk`} readonly /><label for={`${type}-prk`}
                    >PERKS</label
                >
            </div>
            <span>+</span>
            <div class="formula-box">
                <input type="number" id={`${type}-arm`} readonly /><label for={`${type}-arm`}
                    >ARMOR</label
                >
            </div>
        </div>
    </div>

    <div class="skills-list">
        {@render children()}
    </div>
</div>

<style>
    .essence-controls {
        display: inline-flex;
        align-items: center;
        gap: 2px;
    }
    .essence-btn {
        background: var(--primary-purple);
        color: white;
        border: none;
        border-radius: 5px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
    }
    .essence-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
    .boost-labels {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        margin-bottom: 22px;
        z-index: 2;
    }
    .essence-boost-label {
        font-size: 14px;
        font-weight: bold;
        color: var(--primary-purple);
        background: white;
        padding: 2px 8px;
        border-radius: 10px;
        border: 1px solid var(--primary-purple);
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .origin-boost {
        border-color: #d4a017;
        color: #8b6914;
    }
    .skill-points-bubble {
        position: absolute;
        top: 22px;
        right: 8px;
        background: var(--primary-purple);
        color: white;
        border-radius: 10px;
        padding: 2px 8px;
        display: flex;
        align-items: center;
        gap: 3px;
        font-family: var(--font-main);
        z-index: 10;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .skill-points-bubble.empty {
        background: #888;
        opacity: 0.6;
    }
    .sp-num {
        font-size: 16px;
        font-weight: bold;
    }
    .sp-label {
        font-size: 14px;
    }
</style>
