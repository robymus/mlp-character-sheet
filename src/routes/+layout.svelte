<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { children, data } = $props();
    const session = $derived(data.session);
    const isStandalone = $derived($page.url.pathname === '/standalone');
</script>

{#if isStandalone}
    {@render children()}
{:else}
    <Sidebar {session} />
    {@render children()}
{/if}
