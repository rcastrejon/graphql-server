import { mutationField, objectType, stringArg, unionType } from '@nexus/schema';
import { compare } from 'bcryptjs';
import { isEmailValid } from '../../utils/isEmailValid';

export const LoginSuccess = objectType({
  name: 'LoginSuccess',
  definition(t) {
    t.boolean('ok', { nullable: false });
  },
});

export const LoginError = objectType({
  name: 'LoginError',
  definition(t) {
    t.boolean('ok', { nullable: false });
    t.string('message', { nullable: false });
  },
});

export const LoginResult = unionType({
  name: 'LoginResult',
  definition(t) {
    t.members(LoginSuccess, LoginError);
    t.resolveType((i) => (i.ok ? 'LoginSuccess' : 'LoginError'));
  },
});

export const LoginMutation = mutationField('login', {
  type: LoginResult,
  args: {
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false }),
  },
  resolve: async (_, { email, password }, ctx) => {
    const lowerEmail = email.toLowerCase();
    if (!password || !isEmailValid(lowerEmail))
      return { ok: false, message: 'Invalid input.' };

    const account = await ctx.prisma.account.findOne({
      where: {
        email: lowerEmail,
      },
    });

    if (!account) return { ok: false, message: 'Incorrect credentials.' };
    const valid = await compare(password, account.password);
    if (!valid) return { ok: false, message: 'Incorrect credentials.' };

    return {
      ok: true,
    };
  },
});
