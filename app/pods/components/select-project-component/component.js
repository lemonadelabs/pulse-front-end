import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $('.project-container').masonry({
        // options
        itemSelector: '.project-card',
        // columnWidth: 200
        "gutter": 20,
        isFitWidth: true
      });
    });
  }
});
