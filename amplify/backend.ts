import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';

/**
 * Amplify Gen 2 Backend定義
 * 
 * @see https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/
 */
const backend = defineBackend({
  auth,
  // 将来的にStorage、Functionsなどを追加可能
});

export default backend; 