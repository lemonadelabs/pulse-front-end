import { moduleForModel, test } from 'ember-qunit';

moduleForModel('stakeholder', 'Unit | Model | stakeholder', {
  // Specify the other units that are required for this test.
  needs: ['model:stakeholder-snapshot']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
