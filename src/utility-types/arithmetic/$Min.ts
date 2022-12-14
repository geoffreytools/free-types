import { $Optional } from '../../essential/adapters/$Optional';
import { $Choose } from '../logic/$Choose';
import { $Lte } from './$Lte';

export type $Min<T extends number = never> =
    $Optional<$Choose<$Lte>, [T]>;
