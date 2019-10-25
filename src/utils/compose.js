export default function() {
    let composes = [];

    for(let i = 0; i < arguments.length; i++) {
        composes[i] = arguments[i];
    }

    if(composes.length === 0) {
        return function(arg) {
            return arg;
        };
    }

    if(composes.length === 1) {
        return composes[0];
    }

    return composes.reduce(function(a, b) {
        return function() {
            return a(b.apply(undefined, arguments));
        };
    });
};