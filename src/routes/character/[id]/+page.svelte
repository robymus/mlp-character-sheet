<script lang="ts">
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    let { data } = $props();

    // svelte-ignore state_referenced_locally
    const character = CharacterStore.fromJSON(data.characterData, data.characterId);
    setCharacterContext(character);
</script>

<CharacterSheet mode="full" isLoggedIn={true} />
