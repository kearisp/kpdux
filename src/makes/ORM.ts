import {
    AnyAction
} from "redux";
import {
    ORM as ReduxOrm
} from "redux-orm";

import {
    IORM,
    IORMOptions,
    IORMState
} from "../types";


const ormActions = {
    save: "KP_ORM/create",
    remove: "KP_ORM/remove",
    cache: "KP_ORM/cache"
};


class ORM implements IORM {
    constructor(options:IORMOptions) {
        const {
            mode,
            dataProvider
        } = options;
    }

    register(...models:any[]):void {
        for(let i in models) {
            let model = models[i];

            console.log("register", model, model.name);
        }
    }

    getEmptyState():IORMState {
        return {};
    }

    getReducer() {
        return (state:IORMState, action:AnyAction):IORMState => {
            switch(action.type) {
                case ormActions.cache:
                    break;
            }

            return state;
        };
    }
}


export default ORM;