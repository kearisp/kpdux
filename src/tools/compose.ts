export default (...args:any[]) => {
    let composes = [];

    for(let i = 0; i < args.length; i++) {
        composes[i] = args[i];
    }

    if(composes.length === 0) {
        return function(arg:any) {
            return arg;
        };
    }

    if(composes.length === 1) {
        return composes[0];
    }

    return composes.reduce(function(a, b) {
        return function() {
            return a(b.apply(undefined, args));
        };
    });
};