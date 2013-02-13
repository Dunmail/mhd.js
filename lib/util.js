
function inherit(p) {
    if (p==null ) throw TypeError();
    if (Object.create) {return Object.create(p)};

}

/* Enumeration helper */
function enumeration(namesToValues){
    var enumeration = function() {throw "Can't instantiate enumerations"};

    var proto = enumeration.prototype = {
        constructor: enumeration,
        toString: function() { return this.name; },
        valueOf: function() { return this.value; },
        toJSON: function() { return this.name; }
    }

    enumeration.values=[];

    for (name in namesToValues){
        var e = inherit(proto);
        e.name = name;
        e.value = namesToValues[name];
        enumeration.values.push[e];
    }
    enumeration.foreach = function(f,c) {
        for(var i = 0; i < this.values.length; i++) {f.call(c, this.values[i]) }
    };

    return enumeration;
}

exports.enumeration = enumeration;