import { getContext, setContext } from 'svelte';
import { CharacterStore } from './store.svelte';

const CHARACTER_KEY = Symbol('character');

export function setCharacterContext(store: CharacterStore) {
    setContext(CHARACTER_KEY, store);
}

export function getCharacterContext(): CharacterStore {
    return getContext<CharacterStore>(CHARACTER_KEY);
}
