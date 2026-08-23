import { Const, partial, Type, apply } from 'core';
import { $Fork } from '../logic';
import { $Reduce, Reduce } from 'mappables/Reduce';
import { $IsEmpty } from 'mappables/IsEmpty';
import { $As } from 'adapters/$As';
import { $Stitch } from './$Stitch';
import { Showable } from './common';
import { $OptionalFlip } from 'essential';

export type $Join<S extends Showable> = $As<$Fork<
    $IsEmpty,
    Const<''>,
    $Reduce<partial<$Stitch, [S]>>,
    [Showable[]]
>, string>

// type $Join<S extends Showable = never> = $OptionalFlip<$Join2, [S]>

// interface $Join2 extends Type<[Showable[], Showable], string> {
//     type: Showable[] extends this[0]
//         ? string
//         : this['arg'][0] extends [any, ...any[]]
//         ? Reduce<this['arg'][0], partial<$Stitch, [this['arg'][1]]>>
//         : ''
// }