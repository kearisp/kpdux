import compose from "./utils/compose";
import mixin from "./utils/mixin";
import createStore from "./utils/createStore";
import createModule from "./utils/createModule";
import {
    IModule
} from "./interfaces";


export {
    compose,
    mixin,
    createStore,
    createModule,
    IModule
};

export default {
    "compose": compose,
    "mixin": mixin,
    "createStore": createStore,
    "createModule": createModule
};