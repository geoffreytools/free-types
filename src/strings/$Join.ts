import { Const, partial } from 'core';
import { $Fork } from '../logic/$Fork';
import { $Reduce } from 'mappables/Reduce';
import { $IsEmpty } from 'mappables/IsEmpty';
import { $As } from 'adapters/$As';
import { $Stitch } from './$Stitch';
import { Showable } from './common';

export type $Join<S extends Showable> = $As<$Fork<
    $IsEmpty,
    Const<''>,
    $Reduce<partial<$Stitch, [S]>>,
    [Showable[]]
>, string>
