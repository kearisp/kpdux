import Store from "../makes/Store";

import {
    IStore,
    IStoreOptions
} from "../types";


export default (
  modules:IStoreOptions["modules"] = {},
  reducers:IStoreOptions["reducers"] = {},
  middlewares:IStoreOptions["middlewares"] = []
):IStore => {
    return new Store({
        modules,
        reducers,
        middlewares
    });
};