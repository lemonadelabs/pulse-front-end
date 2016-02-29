import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stakeholder-card', 'Integration | Component | stakeholder card', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{stakeholder-card}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#stakeholder-card}}
      template block text
    {{/stakeholder-card}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
