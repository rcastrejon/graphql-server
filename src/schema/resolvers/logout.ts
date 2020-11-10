import { mutationField, objectType } from '@nexus/schema';
import { userSessionIdPrefix } from '../../constants';

export const LogoutResult = objectType({
  name: 'LogoutResult',
  definition(t) {
    t.boolean('ok', { nullable: false });
  },
});

export const LogoutMutation = mutationField('logout', {
  type: LogoutResult,
  resolve: async (_, __, ctx) => {
    // Delete session from user registry
    const { session } = ctx.request;
    ctx.redis.lrem(
      `${userSessionIdPrefix}${session.accountId}`,
      0,
      session.sessionId
    );

    // Destroy session
    const res = await new Promise<boolean>((res) => {
      ctx.request.destroySession((err) => {
        if (err) res(false);
        else res(true);
      });
    });

    return { ok: res };
  },
});
