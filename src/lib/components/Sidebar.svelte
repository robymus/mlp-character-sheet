<script lang="ts">
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import type { Session } from '@auth/sveltekit';

    let { session }: { session: Session | null } = $props();

    interface CharacterSummary {
        id: string;
        name: string;
        origin: string | null;
        cutieMark: string | null;
        description: string | null;
    }

    let characters = $state<CharacterSummary[]>([]);
    let sidebarOpen = $state(false);

    function handleSignIn() {
        // Save any in-progress character data to sessionStorage before redirecting to OAuth
        try {
            const event = new CustomEvent('save-before-login');
            window.dispatchEvent(event);
        } catch {
            // ignore
        }
        // Suppress browser "Leave site?" dialog during auth redirect
        window.addEventListener(
            'beforeunload',
            (event) => {
                delete event['returnValue'];
            },
            true,
        );
        signIn('github');
    }

    export function refreshCharacters() {
        if (session?.user) {
            fetch('/api/characters')
                .then((r) => r.json())
                .then((data) => (characters = data as CharacterSummary[]));
        }
    }

    $effect(() => {
        if (session?.user) {
            refreshCharacters();
        } else {
            characters = [];
        }
    });

    $effect(() => {
        const handler = () => refreshCharacters();
        window.addEventListener('character-saved', handler);
        return () => window.removeEventListener('character-saved', handler);
    });
</script>

<button class="hamburger" onclick={() => (sidebarOpen = !sidebarOpen)} aria-label="Toggle menu">
    &#9776;
</button>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if sidebarOpen}
    <div class="sidebar-overlay" onclick={() => (sidebarOpen = false)}></div>
{/if}

<aside class="sidebar" class:open={sidebarOpen}>
    {#if session?.user}
        <div class="user-info">
            {#if session.user.image}
                <img src={session.user.image} alt="" class="avatar" />
            {/if}
            <span class="user-name">{session.user.name || 'User'}</span>
            <button class="btn-signout" onclick={() => signOut()}>Sign out</button>
        </div>

        <nav class="character-list">
            <a
                href={resolve('/new')}
                class="new-character"
                class:active={$page.url.pathname === '/new'}
                onclick={() => (sidebarOpen = false)}
            >
                + New Character
            </a>
            {#each characters as char (char.id)}
                <a
                    href={resolve('/character/[id]', { id: char.id })}
                    class="character-item"
                    class:active={$page.params.id === char.id}
                    onclick={() => (sidebarOpen = false)}
                >
                    {#if char.cutieMark}
                        <img
                            src={char.cutieMark.startsWith('/')
                                ? char.cutieMark
                                : `/${char.cutieMark}`}
                            alt=""
                            class="mini-cutie"
                        />
                    {/if}
                    <div class="char-info">
                        <strong>{char.name}</strong>
                        {#if char.origin}<span class="origin">{char.origin}</span>{/if}
                        {#if char.description}<p class="desc">{char.description}</p>{/if}
                    </div>
                </a>
            {/each}
        </nav>
    {:else}
        <button class="btn-signin" onclick={handleSignIn}>Sign in with GitHub</button>
        <p class="login-hint">Sign in to save characters</p>
    {/if}
</aside>

<style>
    .hamburger {
        position: fixed;
        top: 12px;
        left: 12px;
        z-index: 1100;
        background: white;
        border: 2px solid #8b5a96;
        border-radius: 8px;
        font-size: 1.4rem;
        padding: 6px 10px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .hamburger:hover {
        background: #f3e5f5;
    }
    .sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1050;
    }
    .sidebar {
        position: fixed;
        top: 0;
        left: -300px;
        width: 280px;
        height: 100vh;
        background: white;
        z-index: 1100;
        transition: left 0.25s ease;
        overflow-y: auto;
        box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
        padding: 16px;
        padding-top: 60px;
    }
    .sidebar.open {
        left: 0;
    }
    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
        margin-bottom: 12px;
        flex-wrap: wrap;
    }
    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
    .user-name {
        font-weight: 600;
        font-size: 0.9rem;
        flex: 1;
    }
    .btn-signout {
        font-size: 0.75rem;
        padding: 4px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f5f5f5;
        cursor: pointer;
    }
    .character-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .new-character,
    .character-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        font-size: 0.85rem;
    }
    .new-character {
        font-weight: 700;
        color: #8b5a96;
        border: 1px dashed #ce93d8;
    }
    .new-character:hover,
    .character-item:hover {
        background: #f3e5f5;
    }
    .new-character.active,
    .character-item.active {
        background: #e1bee7;
    }
    .mini-cutie {
        width: 36px;
        height: 36px;
        object-fit: contain;
        flex-shrink: 0;
    }
    .char-info {
        min-width: 0;
    }
    .char-info strong {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .origin {
        font-size: 0.75rem;
        color: #888;
    }
    .desc {
        font-size: 0.75rem;
        color: #999;
        margin: 2px 0 0;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .btn-signin {
        width: 100%;
        padding: 10px;
        background: #333;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
    }
    .btn-signin:hover {
        background: #555;
    }
    .login-hint {
        text-align: center;
        color: #999;
        font-size: 0.8rem;
        margin-top: 8px;
    }
</style>
