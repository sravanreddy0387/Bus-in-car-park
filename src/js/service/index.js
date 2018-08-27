import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);


import HttpServices from './http.services';
servicesModule.service('HttpServices', HttpServices);



export default servicesModule;
