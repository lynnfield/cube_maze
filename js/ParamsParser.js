
function ParamsParser(defaults) {
    this.sizeX = defaults.defaultX;
    this.sizeY = defaults.defaultY;
    this.sizeZ = defaults.defaultZ;

    function getInt(value, fallback) {
        var tmp = parseInt(value);
        if (!isNaN(tmp))
            return tmp;
        return fallback;
    }

    var params = location.search.replace('?', '');
    params = params.split('&');

    for (var i = 0; i < params.length; ++ i) {
        var keyValuePair = params[i].split('=');
        var key = keyValuePair[0].toLowerCase();
        var value = keyValuePair[1];
        switch (key) {
            case 'sizex':
                this.sizeX = getInt(value, defaults.defaultX);
                break;
            case 'sizey':
                this.sizeY = getInt(value, defaults.defaultY);
                break;
            case 'sizez':
                this.sizeZ = getInt(value, defaults.defaultZ);
                break;
        }
    }

    return this;
}
