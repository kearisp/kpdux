import StoreModule from "../makes/StoreModule";


export default (name:any, ...parts:any[]):StoreModule => {
    let moduleData:any = {};

    if(typeof name !== "string") {
        parts.unshift(name);

        name = "";
    }

    if(parts.length === 1) {
        moduleData = parts[0];

        if(typeof moduleData === "function") {
            moduleData = moduleData();
        }

        if(moduleData instanceof StoreModule) {
            return moduleData;
        }
    }
    else {
        for(let i in parts) {
            let part = parts[i];

            if(typeof part === "function") {
                part = part();
            }

            part = part._data || part;

            moduleData = {
                name: moduleData.name || part.name,
                state: {
                    ...(moduleData.state || {}),
                    ...(part.state || {})
                },
                reduces: {
                    ...(moduleData.reduces || {}),
                    ...(part.reduces || {})
                },
                middlewares: {
                    ...(moduleData.middlewares || {}),
                    ...(part.middlewares || {})
                },
                getters: {
                    ...(moduleData.getters || {}),
                    ...(part.getters || {})
                },
                mutations: {
                    ...(moduleData.mutations || {}),
                    ...(part.mutations || {})
                },
                actions: {
                    ...(moduleData.actions || {}),
                    ...(part.actions || {})
                }
            };
        }
    }

    if(!name) {
        name = moduleData.name || "";
    }

    return new StoreModule(name, moduleData);
};