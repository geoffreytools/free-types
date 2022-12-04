export declare type Key = string | number | symbol;
export declare type Obj<T = unknown> = {
    [k: Key]: T;
};
export declare type Mappable<T = unknown> = Obj<T> | T[];
export declare type NonEmptyMappable<T = unknown> = Obj<T> | [T, ...T[]];
export declare type NonEmptyTuple<T = unknown> = [T, ...T[]];
