import { makeSchema } from '@nexus/schema';
import { nexusPrisma } from 'nexus-plugin-prisma';
import { join } from 'path';
import * as types from './types';

export const schema = makeSchema({
  types,
  plugins: [nexusPrisma()],
  outputs: {
    typegen: join(
      __dirname,
      '../../node_modules/@types/nexus-typegen/index.d.ts'
    ),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: require.resolve('.prisma/client/index.d.ts'),
        alias: 'prisma',
      },
      {
        source: require.resolve('../context'),
        alias: 'ContextModule',
      },
    ],
    contextType: 'ContextModule.Context',
  },
});
