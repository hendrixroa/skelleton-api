import { expect } from 'chai';
import * as sinon from 'sinon';

import { api } from '@/apps/api/api';
import '../../apiTestHooks';

before(async function() {
  this.timeout(5 * 60 * 1000);
  const stub = sinon.stub(api, 'listen');
  await require('@/apps/api/server').default; // wait for app to init
  expect(stub.calledOnce).to.equal(true);
  expect(stub.firstCall.args[0]).to.equal(parseInt(`${process.env.PORT}`, 10));
});
