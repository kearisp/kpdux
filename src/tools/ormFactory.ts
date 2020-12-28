import {
    ORM as ReduxORM,
    Model as ReduxModel
} from "redux-orm";
import * as lodash from "lodash";

import {
    IModule,
    IModuleOptions,
    IORMState,
    IORMOptions
} from "../types";


interface saveAction {
    type:"kp-orm/save";
}


export const ormActions = {
    save: "kp-orm/save",
    remove: "kp-orm/remove",
    search: "kp-orm/search"
};

export default (options:IORMOptions = {}):IModuleOptions<IORMState> => {
    const {
        models = []
    } = options;

    // const orm = new ReduxORM();
    // orm.register(...models);

    return {
        state: {
            ...models.reduce((state, model) => {
                state[model.name] = {
                    queryIds: {},
                    queryTotal: {},
                    byId: {}
                };

                return state;
            }, {})
        },
        reduces: {
            [ormActions.save]: (state:any, action) => {
                const {
                    item
                } = action;

                console.log(item);

                // const session = orm.session(state);

                // // @ts-ignore
                // const Model = session.sessionBoundModels.find((model) => {
                //     return model.modelName === action.name;
                // });

                // if(Model) {
                //     if(!Model.idExists(action.item.id)) {
                //         Model.create(action.item);
                //     }
                //     else {
                //         Model.withId(action.item.id).update(action.item);
                //     }
                // }

                // return session.state;
                return state;
            },
            [ormActions.remove]: (state:any, action) => {
                // const session = orm.session(state);
                //
                // // @ts-ignore
                // const Model = session.sessionBoundModels.find((model) => {
                //     return model.modelName === action.name;
                // });
                //
                // if(Model) {
                //     if(Model.idExists(action.id)) {
                //         Model.withId(action.id).delete();
                //     }
                // }
                //
                // return session.state;

                return state;
            },
            [ormActions.search]: (state:any, action) => {
                return state;
            }
        },
        middlewares: {},
        getters: {
            // session(state:any) {
            //     return orm.session(state);
            // },
            // getModel(state, getters) {
            //     const session = getters.session;
            //
            //     return (type:string) => {
            //         return session.sessionBoundModels.find((Model:any) => {
            //             return Model.modelName === type;
            //         });
            //     };
            // },
            // getItem(state, getters) {
            //     return (type:string, id:number) => {
            //         const Model:any = getters.getModel(type);
            //
            //         if(Model) {
            //             const item = Model.withId(id);
            //
            //             return item && item.ref;
            //         }
            //
            //         return null;
            //     };
            // },
            // getItems(state, getters) {
            //     return (type:string) => {
            //         const Model:any = getters.getModel(type);
            //
            //         if(Model) {
            //             return Model.all().toRefArray();
            //         }
            //         else {
            //             console.error("Model '" + type + "' is missing.");
            //
            //             return [];
            //         }
            //     };
            // },
            // find(state, getters) {
            //     return (type:string, query:any = {}) => {
            //         const Model = getters.getModel(type);
            //
            //         if(Model) {
            //             let querySet = Model.all();
            //
            //             const {
            //                 orderBy = {},
            //                 ...params
            //             } = query;
            //
            //             for(let key in params) {
            //                 let value = params[key];
            //
            //                 if(Model.filters && Model.filters[key]) {
            //                     querySet = querySet.filter((item:any) => {
            //                         return Model.filters[key](item, value);
            //                     });
            //                 }
            //                 else {
            //                     switch(typeof value) {
            //                         case "bigint":
            //                         case "boolean":
            //                         case "number":
            //                         case "string":
            //                         case "symbol":
            //                         case "undefined":
            //                             querySet = querySet.filter((item:any) => {
            //                                 return item[key] === value;
            //                             });
            //                             break;
            //
            //                         case "object":
            //                             querySet = querySet.filter((item:any) => {
            //                                 return lodash.isEqual(item[key], value);
            //                             });
            //                             break;
            //
            //                         case "function":
            //                             querySet = querySet.filter(value);
            //                             break;
            //
            //                         default:
            //                             console.error(typeof value);
            //                             break;
            //                     }
            //                 }
            //             }
            //
            //             // if(orderBy && Object.keys(orderBy).length) {
            //             //     querySet = querySet.orderBy(Object.keys(orderBy), Object.values(orderBy));
            //             // }
            //
            //             return querySet.toModelArray();
            //         }
            //
            //         return [];
            //     };
            // },
            // findOne(state, getters) {
            //     return (type:string, query:any = {}) => {
            //         let list:any[] = getters.find(type, query);
            //
            //         if(list.length > 0) {
            //             return list[0];
            //         }
            //
            //         return null;
            //     };
            // }
        },
        actions: {
            async save(type:string, item:any) {
                console.log("orm.save(", type, item, ")");

                return this.store.dispatch({
                    type: ormActions.save,
                    name: type,
                    item: item
                });
            },
            async remove(type:string, id:any) {
                // console.log("orm.remove(", type, id, ")");
                //
                // return this.store.dispatch({
                //     type: ormActions.remove,
                //     name: type,
                //     id: id
                // });
            },
            async search(type:string, query:any) {
                const {
                    page
                } = query;

                let res = await this.store.dispatch({
                    type: ormActions.search,
                    name: type,
                    query: query
                });

                console.log(type, query, res);
            }
        },
        mutations: {}
    } as IModuleOptions<IORMState>;
};