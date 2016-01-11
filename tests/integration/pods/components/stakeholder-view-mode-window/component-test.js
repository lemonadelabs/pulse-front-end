import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stakeholder-view-mode-window', 'Integration | Component | stakeholder view mode window', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{stakeholder-view-mode-window}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#stakeholder-view-mode-window}}
      template block text
    {{/stakeholder-view-mode-window}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
