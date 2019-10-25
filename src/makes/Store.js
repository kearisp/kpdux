import * as redux from "redux";

import createModule from "./../utils/createModule";


class Store {
    constructor(params) {
        const {
            modules = {},
            reducers = {},
            middlewares = []
        } = params;

        this.modules = {};

        let modulesRedusers = {};
        let modulesMiddlewares = [];

        for(let name in modules) {
            this.modules[name] = createModule(modules[name]);
            this.modules[name].name = name;

            modulesRedusers[name] = this.modules[name].reduce();
            modulesMiddlewares.push(this.modules[name].middleware());
        }

        let reducer = redux.combineReducers({
            ...modulesRedusers,
            ...reducers
        });

        let middleware = redux.applyMiddleware(...[
            ...modulesMiddlewares,
            ...middlewares
        ]);

        this.store = redux.createStore(reducer, {}, middleware);

        for(let name in this.modules) {
            this.modules[name].setActions(this.store);

            if(!this[name]) {
                this[name] = this.modules[name];
            }
        }
    }

    getStore() {
        return this.store;
    }

    getModules() {
        return this.modules;
    }
}


export default Store;