import { queryField } from '@nexus/schema';

export const helloQuery = queryField('hello', {
  type: 'String',
  resolve: () => 'ok',
});
