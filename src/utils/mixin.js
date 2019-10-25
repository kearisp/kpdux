export default (mixin) => {
    return function(component) {
        for(let i in mixin) {
            if(!component.prototype[i]) {
                component.prototype[i] = mixin[i];
            }
        }

        return component;
    };
};