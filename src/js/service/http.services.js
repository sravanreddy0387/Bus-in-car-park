
class HttpServices {

    constructor($http) {
        'ngInject';

        this.http = $http;
    }

    getData() {
        return this.http.get("fetch-simulator-config").then((response) => {
            return response.data;
        });
    }
}

export default HttpServices;

