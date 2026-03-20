export async function load(event) {
    let session = null;
    try {
        session = await event.locals.auth();
    } catch {
        // Auth not available (e.g. dev without wrangler)
    }
    return { session };
}
