class AppController{
    constructor(HttpServices, $http) {
        'ngInject';
        this.HttpServices = HttpServices;
        this.http = $http;
        this.loading = true
        this.HttpServices.getData().then((data) => {
            this.config   = data.config;
            console.log('9', data);
            this.carPark  = [];
            var x,y;
            for (var row = 0; row < this.config.carPark.lengthX; row++) {
                this.carPark[row] = [];
                x = 0;
                y = this.config.carPark.lengthY - 1 - row ;
                for (var col = 0; col < this.config.carPark.lengthY; col++) {
                    this.carPark[row].splice(col,0,{x:x, y:y });
                    x++;
                }
            }
            this.loading = false;
        });
    }

   
    
    controlBus (cmd){
        if (cmd !== undefined ){
            this.executing = true;
            var url = {
                        method: 'POST',
                        url: '/control-bus',
                        headers: {
                          "content-type": "application/json",
                        },
                        data: { 
                                cmd : cmd
                            }
                        };

            this.http(url).then(
                (response) => {
                    this.executing = false;
                    this.message = response.data.message;
                    this.success = response.data.success;
                    this.currentPos = response.data.currentPos;
                }, function(response) {
                    console.log('error');
                }
            );
        }    
    };
    
     keyCmds($event){
        if ($event.keyCode != 38 && (this.currentPos === undefined || this.currentPos.x === undefined || this.currentPos.y === undefined || this.currentPos.f === undefined)){ 
            this.success = false;
            this.message = 'Start by placing the bus on the car park PLACE X, Y, F Or use the UP arrow key to place it at 0,0, NORTH';
            return;
        }
        if ($event.keyCode == 38){
            if (this.currentPos === undefined || this.currentPos.x === undefined || this.currentPos.y === undefined || this.currentPos.f === undefined) {
                this.controlBus('PLACE 0,0,NORTH');
            }
            else if(this.currentPos.f === 'NORTH'){
                this.controlBus('MOVE');
            }
            else {
                this.controlBus('PLACE '+ this.currentPos.x + ',' + this.currentPos.y + ',' + 'NORTH');
            }
        } else if ($event.keyCode == 39) {
            if (this.currentPos === undefined || this.currentPos.x === undefined || this.currentPos.y === undefined || this.currentPos.f === undefined) {
                return;
            }
            
            if(this.currentPos.f === 'EAST'){
                this.controlBus('MOVE');
            }
            else {
                this.controlBus('PLACE '+ this.currentPos.x + ',' + this.currentPos.y + ',' + 'EAST');
            }
        }
        else if ($event.keyCode == 40){
            if (this.currentPos === undefined || this.currentPos.x === undefined || this.currentPos.y === undefined || this.currentPos.f === undefined) {
                return;
            }
            
            if(this.currentPos.f === 'SOUTH'){
                this.controlBus('MOVE');
            }
            else {
                this.controlBus('PLACE '+ this.currentPos.x + ',' + this.currentPos.y + ',' + 'SOUTH');
            }
        }    
        else if ($event.keyCode == 37){
            if (this.currentPos === undefined || this.currentPos.x === undefined || this.currentPos.y === undefined || this.currentPos.f === undefined) {
                return;
            }
            
            if(this.currentPos.f === 'WEST'){
                this.controlBus('MOVE');
            }
            else {
                this.controlBus('PLACE '+ this.currentPos.x + ',' + this.currentPos.y + ',' + 'WEST');
            }
        }    
    };




}

export default AppController;