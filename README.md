# kpdux

### Install

```
npm install kpdux redux
```

### Usage

#### Init:
```JavaScript
import kpdux from "kpdux";


const store = kpdux.createStore({
    "auth": {
        "state": {
            "token": ""
        },
        "reduces": {
            "REDUCER/TYPE": function(state, action) {
                if(/*  */) {
                    return {
                        /*  */
                        ...state
                    };
                }

                return state;
            }
        },
        "middlewares": {
            "MIDDLEWARE/TYPE": async function(action) {
                let state = this.getState();

                await this.exampleAction();
            }
        },
        "getters": {
            getToken(state, getters, rootState, rootGetters) {
                return state.token;
            }
        },
        "mutations": {
            setToken(state, token) {
                state.token = token;
            }
        },
        "actions": {
            async auth(login, password) {
                let state = this.getState();

                // send your data

                this.setToken("your token");
            },
            async exampleAction() {
                
            }
        }
    }
}, {
    // your reduces
}, {
    // your middlewares
});
```

```JavaScript
import React from "react";
import {Provider} from "react-redux";
import ReactDOM from "react-dom";


ReactDOM.render(
    <Provider store={store.getStore()}>
        {/* Your APP */}
    </Provider>,
    document.getElementById("root")
);
```


#### With react-redux:
```JavaScript
import React from "react";
import {connect} from "react-redux";
// ...

class AuthForm extends React.Component {
    // ...
    async login() {
        await this.props.login("login", "password");
    }
    // ...
    render() {
        // ...
    }
}


const putStateToProps = (state) => {
    return {
        // getters like function
        "token": state.auth.getToken()
        
        // getters like property
        "token": state.auth.getters.getToken
    };
};

const putActionsToProps = () => {
    return {
        // actions
        "login": store.auth.login
    };
};

export default connect(putStateToProps, putActionsToProps)(AuthForm);
```