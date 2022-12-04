import { Type } from 'free-types-core';
import { ArrayKeys, Slice } from 'free-types-core/dist/utils';
import { Union2Tuple } from '../essential/utils';
import { _Object2Tuple } from '../essential/mappables/Object2Tuple';
import { Mappable } from '../essential/mappables/common';
import { IndexOf, NormalizeArgs, SelectValue } from './creation';
export { From };
/** Create a new `Type` based upon an iterable `T`. Optionally take a tuple `Args` to determine which fields to turn into a parameter and in what order they will have to be applied. */
declare type From<T extends Mappable<any>, Args extends Keys[] = never, Keys = keyof T> = $From<T, [
    Args
] extends [never] ? T extends unknown[] ? GetIndices<T> : Union2Tuple<Keys> : NormalizeArgs<Args>>;
interface $From<T, Keys extends unknown[]> extends Type<Slice<_Object2Tuple<T, Keys>, 0, Keys['length']>> {
    type: FromN<this['arguments'], Keys, T>;
}
declare type FromN<This extends unknown[], Keys extends unknown[], T> = {
    [K in keyof T]: SelectValue<T[K], This, IndexOf<K, Keys>>;
};
declare type GetIndices<T extends unknown[]> = {
    [K in keyof T]: K extends ArrayKeys ? T[K] : K;
};
