import { $Optional } from '../../essential/adapters/$Optional';
import { $Choose } from '../logic/$Choose';
import { $Gte } from './$Gte';

export type $Max<T extends number = never> =
    $Optional<$Choose<$Gte>, [T]>;
