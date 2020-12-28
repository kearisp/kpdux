export type IGetter = any;
export type IGetterHandler<State> = (state:State, getters:IGetters, rootState:any, rootGetters:IGetters) => any;
export type IReduceHandler<State> = (state:State, action:any) => State;
export type IMiddlewareHandler<State> = (state:State, action:any) => any;
export type IActionHandler<State> = (
    this:IModule<State> & IActionHandlers<State> & IMutationHandlers<State>,
    ...attrs:any[]
) => any;
export type IMutationHandler<State> = (state:State, ...attrs:any[]) => void;

export interface IGetters {
    [key:string]:IGetter;
}

export interface IRootGetters {
    [name:string]:IGetters;
}

export interface IGetterHandlers<State> {
    [key:string]:IGetterHandler<State>;
}

export interface IReduceHandlers<State> {
    [key:string]:IReduceHandler<State>;
}

export interface IMiddlewareHandlers<State> {
    [key:string]:IMiddlewareHandler<State>;
}

export interface IActionHandlers<State> {
    [key:string]:IActionHandler<State>;
}

export interface IMutationHandlers<State> {
    [key:string]:IMutationHandler<State>;
}

export interface IModuleOptions<State> {
    state?:any;
    reduces?:IReduceHandlers<State>;
    middlewares?:IMiddlewareHandlers<State>;
    getters?:IGetterHandlers<State>;
    actions?:IActionHandlers<State>;
    mutations?:IMutationHandlers<State>;
}

export interface IModule<State> {
    name:string;
    getters:IGetters;
    rootGetters:IRootGetters;
    getState:() => State;
    dispatch:(type:string, ...params:any[]) => any;
    [method:string]:any;
}

export interface IStoreOptions {
    modules:{
        [name:string]:IModuleOptions<any>;
    };
    reducers:any;
    middlewares:any[];
}

export interface IStore {
    modules:{
        [name:string]:IModule<any>;
    };
    getStore:() => any;
    getState:() => any;
    getModules:() => IStore["modules"];
    dispatch:(action:any) => any;
    [key:string]:any;
}

export interface IORMOptions {
    mode?:"client"|"server";
    dataProvider?:any;
    models?:any[];
}

export interface IORMState {
    [key:string]:any;
}

export interface IORM {}