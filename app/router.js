import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('project-overview', { path: '/project-overview/:id'});
  this.route('select-project');
});

export default Router;
