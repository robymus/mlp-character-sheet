<script lang="ts">
    let {
        message,
        onConfirm,
        onCancel,
    }: {
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
    } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={onCancel}>
    <div class="confirm-dialog" onclick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div class="confirm-actions">
            <button class="btn-cancel" onclick={onCancel}>Cancel</button>
            <button class="btn-confirm" onclick={onConfirm}>Confirm</button>
        </div>
    </div>
</div>

<style>
    .confirm-dialog {
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        margin: 0 auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
    }
    .confirm-dialog p {
        font-size: 1.1rem;
        margin-bottom: 20px;
        color: #333;
    }
    .confirm-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
    }
    .confirm-actions button {
        padding: 8px 24px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
    }
    .btn-cancel {
        background: #ddd;
        color: #666;
    }
    .btn-cancel:hover {
        background: #ccc;
    }
    .btn-confirm {
        background: #e74c3c;
        color: white;
    }
    .btn-confirm:hover {
        background: #c0392b;
    }
</style>
