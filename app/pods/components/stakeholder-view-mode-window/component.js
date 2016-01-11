import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-view-mode-window','fancy-corners'],
  classNameBindings: ['visible','ignore-pointer'],
  visible: true,
  connections:true,
  "ignore-pointer":false,
});
