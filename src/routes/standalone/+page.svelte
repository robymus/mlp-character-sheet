<script lang="ts">
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    const character = new CharacterStore();
    setCharacterContext(character);
</script>

<CharacterSheet mode="standalone" />
