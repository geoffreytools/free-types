import { Type, Checked, A } from 'free-types-core';
import { ArrayKeys, Union2Tuple, Mappable } from "free-types-core/dist/utils";

export { $Object2Tuple, Object2Tuple, _Object2Tuple };

interface $Object2Tuple extends Type<[Mappable]> {
    type: unknown extends this[0] ? unknown[]
        : Object2Tuple<Checked<A, this>>
}

type Object2Tuple<T extends {[k: PropertyKey]: any}> =
    _Object2Tuple<T, Union2Tuple<keyof T>>;

type _Object2Tuple<T, Keys> = {
    [K in keyof Keys]
        : K extends ArrayKeys ? Keys[K]
        : Keys[K] extends keyof T ? T[Keys[K]]
        : never
};