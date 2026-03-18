<script lang="ts">
  let { content = '', disabled = false, children } = $props();

  let showTooltip = $state(false);
  
  function handleMouseEnter() {
    if (disabled) showTooltip = true;
  }
  
  function handleMouseLeave() {
    showTooltip = false;
  }
</script>

<div class="tooltip-container" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave} role="tooltip">
  {@render children?.()}
  
  {#if showTooltip && disabled && content}
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
    bottom: 110%; /* Place above the element */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 100;
    pointer-events: none; /* Ensure the tooltip doesn't interfere with hovers on the parent */
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  /* Little triangle arrow */
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
