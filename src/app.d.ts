// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        interface Platform {
            env: {
                DB: D1Database;
                GITHUB_CLIENT_ID: string;
                GITHUB_CLIENT_SECRET: string;
                AUTH_SECRET: string;
            };
        }
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
    }
}

export {};
