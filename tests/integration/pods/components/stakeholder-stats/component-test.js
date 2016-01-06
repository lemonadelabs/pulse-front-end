import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stakeholder-stats', 'Integration | Component | stakeholder stats', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{stakeholder-stats}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#stakeholder-stats}}
      template block text
    {{/stakeholder-stats}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
