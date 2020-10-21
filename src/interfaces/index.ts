export interface IReduces<State> {
    [key:string]:(
        this:IStore<State> & IGetters<State>,
        state:State,
        action:any
    ) => State;
}

export interface IMiddlewares<State> {
    [key:string]:(
        this:IStore<State> & IGetters<State>,
        action:any
    ) => any;
}

export interface IGetters<State> {
    [key:string]:(
        this:IStore<State> & IGetters<State>,
        ...args:any[]
    ) => any;
}

export interface IActions<State> {
    [key:string]:(
        this:IStore<State> & IGetters<State> & IActions<State> & IMutations<State>,
        ...args:any[]
    ) => any;
}

export interface IMutations<State> {
    [key:string]:(this:IStore<State>, state:State, ...args:any[]) => void;
}

export interface IStore<State> {
    module:IModule<State>;
    getters:{
        [key:string]:any;
    };
    rootGetters:{
        [key:string]:any;
    };
    getState:() => State;
    dispatch:(...args:any[]) => any;
}

export interface IModule<State> {
    state?:any;
    reduces?:IReduces<State>;
    middlewares?:IMiddlewares<State>;
    getters?:IGetters<State>;
    actions?:IActions<State>;
    mutations?:IMutations<State>;
}