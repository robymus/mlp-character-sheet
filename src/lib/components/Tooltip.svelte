<script lang="ts">
    /**
     * @param content - Tooltip text
     * @param disabled - When true, tooltip only shows in "warning" mode (legacy behavior)
     * @param alwaysShow - When true, tooltip shows on hover/touch regardless of disabled state
     */
    let {
        content = '',
        disabled = false,
        alwaysShow = false,
        children,
    }: {
        content: string;
        disabled?: boolean;
        alwaysShow?: boolean;
        children: import('svelte').Snippet;
    } = $props();

    let showTooltip = $state(false);
    let touchTimeout: ReturnType<typeof setTimeout> | null = null;

    function show() {
        if (alwaysShow || disabled) showTooltip = true;
    }

    function hide() {
        showTooltip = false;
        if (touchTimeout) {
            clearTimeout(touchTimeout);
            touchTimeout = null;
        }
    }

    function handleTouchStart(e: TouchEvent) {
        if (!alwaysShow && !disabled) return;
        e.preventDefault();
        showTooltip = true;
        // Auto-hide after 3 seconds on touch
        if (touchTimeout) clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            showTooltip = false;
            touchTimeout = null;
        }, 3000);
    }
</script>

<div
    class="tooltip-container"
    onmouseenter={show}
    onmouseleave={hide}
    ontouchstart={handleTouchStart}
    role="tooltip"
>
    {@render children?.()}

    {#if showTooltip && content}
        <div class="tooltip-box">
            {content}
        </div>
    {/if}
</div>

<style>
    .tooltip-container {
        position: relative;
        display: inline-block;
    }

    .tooltip-box {
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: #fff;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: normal;
        min-width: 180px;
        max-width: 280px;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        line-height: 1.3;
    }

    .tooltip-box::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }
</style>
