import { Type } from 'core';
import { Mappable } from './common';

export { IsEmpty, $IsEmpty }

type IsEmpty<T> = T extends readonly unknown[]
    ? T extends [] ? true : false
    : [keyof T] extends [never] ? true : false;

interface $IsEmpty extends Type<[Mappable]> {
    type : IsEmpty<this[0]>
}