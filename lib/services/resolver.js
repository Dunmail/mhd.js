/**
 * Created by dunmail on 10/10/2013 at 16:40
 */

var dependable = require('dependable');

function Resolver() {

    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    this.container = dependable.container();
}

exports.Resolver = Resolver;
