import * as redux from "redux";


class StoreModule {
    /**
     * @constructor
     * @param name      string
     * @param params    object
     */
    constructor(name, params = {}) {
        this.name = name;

        this.state = {};
        this.getters = {};
        this._data = {
            "store": {},
            "init": () => {},
            "reduces": {},
            "getters": {},
            "middlewares": {},
            "mutations": {},
            "actions": {},
            "mutationsCreators": {},
            "actionsCreators": {}
        };

        if(params._data) {
            params = params._data;
        }

        if(params.name) {
            this.name = params.name;
        }

        if(typeof params.init === "function") {
            this._data.init = params.init;
        }

        if(params.state) {
            this.state = params.state;
        }

        if(params.reduces) {
            this._data.reduces = params.reduces;
        }

        if(params.middlewares) {
            this._data.middlewares = params.middlewares;
        }

        if(params.mutations) {
            this._data.mutations = params.mutations;
        }

        if(params.actions) {
            this._data.actions = params.actions;
        }

        if(params.getters) {
            this._data.getters = params.getters;
        }

        Object.defineProperty(this, "rootGetters", {
            "get": () => {
                return this.getRootGetters();
            }
        });
    }

    getRootGetters() {
        let rootGetters = {};

        if(this.store.kpduxModules) {
            Object.keys(this.store.kpduxModules).map((name) => {
                rootGetters[name] = this.store.kpduxModules[name].getters;
            });
        }

        return rootGetters;
    }

    getGetterCreator(getter) {
        return () => {
            return getter.apply(this, [
                this.getState(),
                this.getters,
                this.store.getState(),
                this.getRootGetters()
            ]);
        };
    }

    getActionCreator(name) {
        let _this = this;

        return function() {
            return {
                "type": _this.name + "/" + name,
                "data": arguments
            };
        }
    }

    reduce() {
        return (state, action) => {
            return this.onReduce(state, action);
        }
    }

    middleware() {
        let _this = this;

        return (store) => {
            return (next) => {
                return (action) => {
                    let res = _this.onMiddleware(store, action);

                    if(res) {
                        return Promise.resolve(res).then((data) => {
                            next(action);

                            return data;
                        });
                    }
                    else {
                        return next(action);
                    }
                };
            };
        };
    }

    onReduce(state, action) {
        if(!state) {
            state = this.state;
        }

        let reducer = null;

        if(this._data.reduces["*"]) {
            reducer = this._data.reduces["*"];

            let nState = reducer.apply(this, [state, action]);

            state = {
                ...nState
            };
        }

        if(this._data.reduces[action.type]) {
            reducer = this._data.reduces[action.type];

            let nState = reducer.apply(this, [state, action]);

            return {
                ...nState
            };
        }
        else {
            let [name, type] = action.type.split("/");

            if(this.name === name && this._data.mutations[type]) {
                reducer = this._data.mutations[type];

                let nState = {
                    ...state
                };

                reducer.apply(this, [
                    nState,
                    ...action.data
                ]);

                return nState;
            }
        }

        return state;
    }

    onMiddleware(store, action) {
        if(this._data.middlewares["*"]) {
            this._data.middlewares["*"].apply(this, [action]);
        }

        if(this._data.middlewares[action.type]) {
            return this._data.middlewares[action.type].apply(this, [action]);
        }
        else {
            if(action.type) {
                let [name, type] = action.type.split("/");

                if(this.name === name && this._data.actions[type]) {
                    return this._data.actions[type].apply(this, action.data);
                }
            }
        }

        return null;
    }

    setActions(store) {
        this.store = store;

        this._data.init.apply(this, [store]);

        if(!store.kpduxModules) {
            store.kpduxModules = {};
        }

        store.kpduxModules[this.name] = this;

        for(let i in this._data.mutations) {
            this._data.mutationsCreators[i] = this.getActionCreator(i);
        }

        for(let i in this._data.actions) {
            this._data.actionsCreators[i] = this.getActionCreator(i);
        }

        for(let i in this._data.mutationsCreators) {
            if(!this[i]) {
                this[i] = redux.bindActionCreators(
                    this._data.mutationsCreators[i],
                    store.dispatch
                );
            }
        }

        for(let i in this._data.actionsCreators) {
            if(!this[i]) {
                this[i] = redux.bindActionCreators(
                    this._data.actionsCreators[i],
                    store.dispatch
                );
            }
            else {
                console.error(this.name, i);
            }
        }

        for(let i in this._data.getters) {
            if(!this[i]) {
                this[i] = this.getGetterCreator(this._data.getters[i]);

                Object.defineProperty(this.getters, i, {
                    "get": this[i],
                    "set": function() {}
                });
            }
            else {
                console.error(this.name, i);
            }
        }
    }

    getter(name) {

    }

    dispatch(action, ...args) {
        return this.store.dispatch({
            "type": action,
            "data": args
        });
    }

    getState() {
        if(this.store) {
            return this.store.getState()[this.name] || {};
        }

        return {};
    }
}

export {
    StoreModule
};

export default StoreModule;