import Store from "../makes/Store";


export default (modules:any = {}, reducers:any = {}, middlewares:any[] = []) => {
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