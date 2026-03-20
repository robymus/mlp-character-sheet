import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { D1Adapter } from '@auth/d1-adapter';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
    const env = event.platform?.env;

    // In dev without wrangler, env may be undefined — skip auth adapter
    if (!env?.DB) {
        return {
            providers: [
                GitHub({
                    clientId: env?.GITHUB_CLIENT_ID ?? 'dev',
                    clientSecret: env?.GITHUB_CLIENT_SECRET ?? 'dev',
                }),
            ],
            secret: env?.AUTH_SECRET ?? 'dev-secret-min-32-chars-long-placeholder',
            trustHost: true,
        };
    }

    return {
        providers: [
            GitHub({
                clientId: env.GITHUB_CLIENT_ID,
                clientSecret: env.GITHUB_CLIENT_SECRET,
            }),
        ],
        adapter: D1Adapter(env.DB),
        secret: env.AUTH_SECRET,
        trustHost: true,
        callbacks: {
            session({ session, user }) {
                if (session.user && user) {
                    session.user.id = user.id;
                }
                return session;
            },
        },
    };
});
