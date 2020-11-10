import { mutationField, objectType, stringArg, unionType } from '@nexus/schema';
import { PrismaClientKnownRequestError } from '@prisma/client';
import { hash } from 'bcryptjs';
import { isEmailValid } from '../../utils/isEmailValid';
import { isPasswordValid } from '../../utils/isPasswordValid';

export const RegisterSuccess = objectType({
  name: 'RegisterSuccess',
  definition(t) {
    t.boolean('ok', { nullable: false });
  },
});

export const RegisterError = objectType({
  name: 'RegisterError',
  definition(t) {
    t.boolean('ok', { nullable: false });
  },
});

export const RegisterResult = unionType({
  name: 'RegisterResult',
  definition(t) {
    t.members(RegisterSuccess, RegisterError);
    t.resolveType((i) => (i.ok ? 'RegisterSuccess' : 'RegisterError'));
  },
});

export const RegisterMutation = mutationField('register', {
  type: RegisterResult,
  args: {
    name: stringArg({ nullable: false }),
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false }),
  },
  resolve: async (_, { name, email, password }, ctx) => {
    const lowerEmail = email.toLowerCase();
    if (!isEmailValid(lowerEmail)) return { ok: false };
    if (!isPasswordValid(password)) return { ok: false };

    // Continue if validation passes
    const hashedPassword = await hash(password, 12);
    //  Write user to database, if fail then throw error
    var accountId: string;
    try {
      const account = await ctx.prisma.account.create({
        data: {
          name,
          email: lowerEmail,
          password: hashedPassword,
        },
      });
      accountId = account.id;
    } catch (err) {
      // Handle email conflict as expected error
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        return { ok: false };
      throw new Error(err as string);
    }

    // Everything ok
    return {
      ok: true,
    };
  },
});
