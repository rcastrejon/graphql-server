import { queryField } from '@nexus/schema';
import { isAuth } from '../../utils/isAuth';

export const helloQuery = queryField('hello', {
  authorize: (_, __, ctx) => isAuth(ctx.request.session),
  type: 'String',
  resolve: () => 'Hello!',
});
