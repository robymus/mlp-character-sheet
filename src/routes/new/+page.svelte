<script lang="ts">
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    let { data } = $props();

    const character = new CharacterStore();
    setCharacterContext(character);
</script>

<CharacterSheet mode="full" isLoggedIn={!!data.session?.user} />
