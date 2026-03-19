<script lang="ts">
    import { getCharacterContext } from '$lib/context';
    import ConfirmDialog from './ConfirmDialog.svelte';

    let {
        mode = 'standalone',
        isLoggedIn = false,
    }: {
        mode?: 'standalone' | 'full';
        isLoggedIn?: boolean;
    } = $props();

    const character = getCharacterContext();
    let showResetConfirm = $state(false);
    let lockError = $state('');
    let saving = $state(false);

    async function handleLock() {
        if (!character.name.trim()) {
            lockError = 'Character must have a name to lock.';
            return;
        }

        lockError = '';
        saving = true;

        try {
            // Check name uniqueness via API
            const res = await fetch(
                `/api/characters?checkName=${encodeURIComponent(character.name.trim())}`,
            );
            const { exists, existingId } = (await res.json()) as {
                exists: boolean;
                existingId: string | null;
            };
            if (exists && existingId !== character.id) {
                lockError = `A character named "${character.name}" already exists. Choose a unique name.`;
                saving = false;
                return;
            }

            // Persist
            const method = character.id ? 'PUT' : 'POST';
            const url = character.id ? `/api/characters/${character.id}` : '/api/characters';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: character.serialize(),
            });

            if (!response.ok) {
                const err = (await response.json().catch(() => ({ message: 'Save failed' }))) as {
                    message?: string;
                };
                lockError = err.message || 'Save failed';
                saving = false;
                return;
            }

            const result = (await response.json()) as { id: string };
            if (!character.id) {
                character.id = result.id;
                history.replaceState({}, '', `/character/${result.id}`);
            }
            character.locked = true;
        } catch {
            lockError = 'Network error. Please try again.';
        } finally {
            saving = false;
        }
    }

    function handleUnlock() {
        character.locked = false;
    }

    function confirmReset() {
        character.reset();
        showResetConfirm = false;
        if (mode === 'full') {
            history.replaceState({}, '', '/new');
        }
    }

    async function handleDelete() {
        if (!character.id) return;
        try {
            const res = await fetch(`/api/characters/${character.id}`, { method: 'DELETE' });
            if (res.ok) {
                character.reset();
                window.location.href = '/new';
            }
        } catch {
            lockError = 'Delete failed. Please try again.';
        }
    }

    let showDeleteConfirm = $state(false);
</script>

<div class="status-badge">
    <div class="status-row">
        {#if character.locked}
            <span class="status locked">&#x1f512; Locked</span>
            {#if mode === 'full' && isLoggedIn}
                <button class="btn-status btn-unlock" onclick={handleUnlock}>
                    &#x1f513; Unlock
                </button>
            {/if}
        {:else if character.isComplete}
            <span class="status complete">&#x2705; Complete</span>
            {#if mode === 'full'}
                {#if isLoggedIn}
                    <button class="btn-status btn-lock" onclick={handleLock} disabled={saving}>
                        {saving ? 'Saving...' : '&#x1f512; Lock & Save'}
                    </button>
                {:else}
                    <span class="login-hint">Log in to lock &amp; save</span>
                {/if}
            {/if}
        {:else}
            <span class="status incomplete">&#x1f4dd; In Progress</span>
        {/if}

        {#if !character.locked}
            <button
                class="btn-status btn-reset"
                onclick={() => (showResetConfirm = true)}
                title="Start over"
            >
                &#x1f504; Reset
            </button>
        {/if}

        {#if mode === 'full' && isLoggedIn && character.locked && character.id}
            <button
                class="btn-status btn-delete"
                onclick={() => (showDeleteConfirm = true)}
                title="Delete character"
            >
                &#x1f5d1; Delete
            </button>
        {/if}
    </div>

    {#if lockError}
        <div class="lock-error">{lockError}</div>
    {/if}
</div>

{#if showResetConfirm}
    <ConfirmDialog
        message="Reset this character sheet? All data will be lost."
        onConfirm={confirmReset}
        onCancel={() => (showResetConfirm = false)}
    />
{/if}

{#if showDeleteConfirm}
    <ConfirmDialog
        message="Delete {character.name || 'this character'}? This cannot be undone."
        onConfirm={() => {
            showDeleteConfirm = false;
            handleDelete();
        }}
        onCancel={() => (showDeleteConfirm = false)}
    />
{/if}

<style>
    .status-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
    }
    .status-row {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
    }
    .status {
        font-size: 0.85rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        white-space: nowrap;
    }
    .status.locked {
        background: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #a5d6a7;
    }
    .status.complete {
        background: #e3f2fd;
        color: #1565c0;
        border: 1px solid #90caf9;
    }
    .status.incomplete {
        background: #fff3e0;
        color: #e65100;
        border: 1px solid #ffcc80;
    }
    .btn-status {
        font-size: 0.8rem;
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        cursor: pointer;
        font-weight: 600;
        white-space: nowrap;
    }
    .btn-status:hover {
        background: #e0e0e0;
    }
    .btn-lock {
        background: #e8f5e9;
        border-color: #a5d6a7;
        color: #2e7d32;
    }
    .btn-lock:hover {
        background: #c8e6c9;
    }
    .btn-unlock {
        background: #fff3e0;
        border-color: #ffcc80;
        color: #e65100;
    }
    .btn-delete {
        background: #ffebee;
        border-color: #ef9a9a;
        color: #c62828;
    }
    .btn-delete:hover {
        background: #ffcdd2;
    }
    .btn-reset {
        background: #f3e5f5;
        border-color: #ce93d8;
        color: #7b1fa2;
    }
    .btn-reset:hover {
        background: #e1bee7;
    }
    .login-hint {
        font-size: 0.8rem;
        color: #999;
        font-style: italic;
    }
    .lock-error {
        color: #c62828;
        font-size: 0.8rem;
        margin-top: 4px;
        font-weight: 600;
    }
</style>
