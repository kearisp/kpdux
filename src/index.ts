import mixin from "./tools/mixin";
import createStore from "./tools/createStore";
import createModule from "./tools/createModule";
import ormFactory, {
    ormActions
} from "./tools/ormFactory";
import Model from "./makes/Model";

import {
    IModule,
    IModuleOptions,
    IORMState
} from "./types";


export {
    Model,
    mixin,
    createStore,
    createModule,
    ormFactory,
    ormActions,
    IModule,
    IModuleOptions,
    IORMState
};

export default {
    mixin: mixin,
    createStore: createStore,
    createModule: createModule,
    ormFactory: ormFactory
};