export function ModelDecorator() {
    return function(target:any) {
        console.log("ModelDecorator", target);

        for(let i in target) {
            console.log(target[i]);
        }
    };
}

export function Field() {
    return function(target:any, propertyKey:string) {
        // console.log(target, propertyKey);
        // descriptor.asd = "qwd";
        // return descriptor;
    };
}

interface IModel {
    create:(data:any) => void;
}


class Model implements IModel {
    static mode:"client"|"server" = "client";

    create(data:any) {
        //
    }

    toJSON():any {
        return {};
    }
}

class TestModel extends Model {
    @Field() id?:string;

    @Field() test?:string;
}


export default Model;