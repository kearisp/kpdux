import Store from "./../makes/Store";


export default (modules = {}, reducers = {}, middlewares = []) => {
    let store = new Store({
        modules,
        reducers,
        middlewares
    });

    return {
        "getStore": () => {
            return store.getStore();
        },
        ...store.getModules()
    };
};