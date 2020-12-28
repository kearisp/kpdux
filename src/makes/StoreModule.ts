import * as redux from "redux";
import {AnyAction} from "redux";

import {
    IGetters,
    IRootGetters,
    IGetterHandlers,
    IReduceHandlers,
    IMiddlewareHandlers,
    IActionHandlers,
    IMutationHandlers,
    IModule,
    IModuleOptions,
    IStore
} from "../types";


class StoreModule<State = any> implements IModule<State> {
    name:string;
    store?:IStore;
    state:State;
    getterHandlers:IGetterHandlers<State> = {};
    reduceHandlers:IReduceHandlers<State> = {};
    middlewareHandlers:IMiddlewareHandlers<State> = {};
    actionHandlers:IActionHandlers<State> = {};
    mutationHandlers:IMutationHandlers<State> = {};

    get getters():IGetters {
        // return Object.keys(this.getterHandlers).reduce<IGetters>((getters:IGetters, name:string) => {
        //     Object.defineProperties()
        //
        //     return getters;
        // }, {});

        return Object.defineProperties({}, Object.keys(this.getterHandlers).reduce((getters:any, name:string) => {
            getters[name] = {
                get: this.getGetterCreator(this.getterHandlers[name])
            };

            return getters;
        }, {}));
    }

    get rootGetters():IRootGetters {
        if(this.store) {
            return Object.keys(this.store.modules).reduce((rootGetters:IRootGetters, name:string) => {
                // @ts-ignore
                rootGetters[name] = this.store.modules[name].getters;

                return rootGetters;
            }, {});
        //     Object.keys(this.store.kpduxModules).map((name:string) => {
        //         rootGetters[name] = this.store.kpduxModules[name].getters;
        //     });
        }

        return {};
    }

    /**
     * @constructor
     * @param name      string
     * @param params    StoreModuleOptions
     */
    constructor(name:string, params:IModuleOptions<State> = {}) {
        const {
            state = {},
            getters = {},
            reduces = {},
            middlewares = {},
            actions = {},
            mutations = {}
        } = params;

        this.name = name;
        this.state = state;

        this.reduceHandlers = reduces;
        this.middlewareHandlers = middlewares;
        this.getterHandlers = getters;
        this.actionHandlers = actions;
        this.mutationHandlers = mutations;
    }

    getGetterCreator(getter:any) {
        return () => {
            return getter.apply(this, [
                this.getState(),
                this.getters,
                this.store ? this.store.getState() : {},
                this.rootGetters
            ]);
        };
    }

    getActionCreator(name:string) {
        return (...args:any[]) => {
            return {
                "type": this.name + "/" + name,
                "data": args
            };
        };
    }

    reduce() {
        return (state:State, action:any) => {
            return this.onReduce(state, action);
        };
    }

    middleware() {
        return (state:State) => {
            return (next:any) => {
                return (action:any) => {
                    let res = this.onMiddleware(state, action);

                    if(res) {
                        return Promise.resolve(res).then((data:any) => {
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

    onReduce(state:State, action:AnyAction):State {
        if(!state) {
            state = this.state;
        }

        let reducer = null;

        if(this.reduceHandlers["*"]) {
            state = this.reduceHandlers["*"].apply(this, [state, action]);
        }

        if(action.type) {
            if(this.reduceHandlers[action.type]) {
                state = this.reduceHandlers[action.type].apply(this, [state, action]);
            }

            let [name, type] = action.type.split("/");

            if(this.name === name && this.mutationHandlers[type]) {
                reducer = this.mutationHandlers[type];

                let nState = {
                    ...state
                };

                reducer.apply(this, [nState, ...action.data]);

                return nState;
            }
        }

        return state;
    }

    onMiddleware(state:State, action:AnyAction):any {
        if(this.middlewareHandlers["*"]) {
            this.middlewareHandlers["*"].apply(this, [state, action]);
        }

        if(this.middlewareHandlers[action.type]) {
            return this.middlewareHandlers[action.type].apply(this, [state, action]);
        }
        else {
            if(action.type) {
                let [name, type] = action.type.split("/");

                if(this.name === name && this.actionHandlers[type]) {
                    // @ts-ignore
                    return this.actionHandlers[type].apply(this, action.data);
                }
            }
        }

        return null;
    }

    setActions(store:IStore) {
        this.store = store;

        for(let i in this.actionHandlers) {
            // @ts-ignore
            if(!this[i]) {
                // @ts-ignore
                this[i] = redux.bindActionCreators(
                    this.getActionCreator(i),
                    (action:any) => store.dispatch(action)
                );
            }
            else {
                console.error(this.name, i);
            }
        }

        for(let i in this.mutationHandlers) {
            // @ts-ignore
            if(!this[i]) {
                // @ts-ignore
                this[i] = redux.bindActionCreators(
                    this.getActionCreator(i),
                    (action:any) => store.dispatch(action)
                );
            }
            else {
                console.error(this.name, i);
            }
        }

        // for(let i in this.getterHandlers) {
        //     if(!this[i]) {
        //         this[i] = this.getGetterCreator(this.getterHandlers[i]);
        //
        //         Object.defineProperty(this.getters, i, {
        //             "get": this[i],
        //             "set": function() {}
        //         });
        //     }
        //     else {
        //         console.error(this.name, i);
        //     }
        // }
    }

    dispatch(type:string, ...args:any[]) {
        return this.store && this.store.dispatch({
            "type": type,
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