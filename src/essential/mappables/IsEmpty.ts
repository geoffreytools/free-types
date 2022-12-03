import { Type } from 'free-types-core';
import { ArrayKeys } from 'free-types-core/dist/utils';
import { Mappable } from './common';

export { IsEmpty, $IsEmpty }

type IsEmpty<T> = Exclude<keyof T, ArrayKeys> extends never ? true : false

interface $IsEmpty extends Type<[Mappable]> {
    type : IsEmpty<this[0]>
}