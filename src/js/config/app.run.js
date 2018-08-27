function AppRun( $rootScope) {
    'ngInject';
    $rootScope.$on('$stateChangeStart', (event, toState) => {
    //  event.preventDefault();
    });
}

export default AppRun;
