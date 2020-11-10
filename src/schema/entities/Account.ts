import { objectType } from '@nexus/schema';

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.name();
    t.model.email();
    t.model.password();
  },
});
