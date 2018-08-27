/**
 * The CarPark class, constructor
 * @param {object} config CarPark's config
 * @constructor
 */
const CarPark = function (config) {
    this._config = config;

    /**
     * Check is X, Y are inside of the playground
     * @param  {INT}  x x-coordinate
     * @param  {INT}  y y-coordinate
     * @return {Boolean}
     */
    this.isOutOfcarPark = function(x, y) {
        if (
            (x > (this._config.startPointX + (this._config.lengthX - 1))) ||
            (x < this._config.startPointX) ||
            (y > (this._config.startPointY + (this._config.lengthY - 1))) ||
            (y < this._config.startPointY)
        ) {
            return true;
        } else
            return false;
    };
};


export default CarPark;
