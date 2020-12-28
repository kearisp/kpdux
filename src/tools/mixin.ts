export default (mixin:any) => {
    return function(component:any) {
        for(let i in mixin) {
            if(!component.prototype[i]) {
                component.prototype[i] = mixin[i];
            }
        }

        return component;
    };
};