import {
    AnyAction,
    Store as ReduxStore
} from "redux";
import * as redux from "redux";

import {
    IStore,
    IStoreOptions,
    IModuleOptions
} from "../types";

import StoreModule from "./StoreModule";


interface StoreOptions {
    modules:{
        [name:string]:IModuleOptions<any>;
    };
    reducers:any;
    middlewares:any[];
}


class Store implements IStore {
    store:any;
    modules:IStore["modules"] = {};

    constructor(params:IStoreOptions) {
        const {
            modules = {},
            reducers = {},
            middlewares = []
        } = params;

        this.modules = {};

        let modulesRedusers:any = {};
        let modulesMiddlewares:any = [];

        for(let name in modules) {
            // this.modules[name] = createModule(modules[name]);
            this.modules[name] = new StoreModule(name, modules[name]);

            modulesRedusers[name] = this.modules[name].reduce();
            modulesMiddlewares.push(this.modules[name].middleware());
        }

        let reducer = redux.combineReducers({
            ...reducers,
            ...modulesRedusers
        });

        let middleware = redux.applyMiddleware(...[
            ...middlewares,
            ...modulesMiddlewares
        ]);

        this.store = redux.createStore(reducer, {}, middleware);

        for(let name in this.modules) {
            this.modules[name].setActions(this);

            // @ts-ignore
            if(!this[name]) {
                // @ts-ignore
                this[name] = this.modules[name];
            }
        }
    }

    getStore():ReduxStore {
        return this.store;
    }

    getState() {
        return this.store.getState();
    }

    getModules():IStore["modules"] {
        return this.modules;
    }

    dispatch(action:AnyAction):any {
        if(this.store) {
            return this.store.dispatch(action);
        }
        else {
            console.log("Store.dispatch", action);
        }
    }
}


export default Store;