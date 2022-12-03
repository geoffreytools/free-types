import { Eq, Prev } from 'free-types-core/dist/utils';
import { And, Extends, IsNatural, Or } from '../../essential/utils';

export type Compare<A, B, Equal extends boolean> =
    And<IsNatural<A>, IsNatural<B>> extends true
    ? _Compare<A & number, B & number, Equal>
    : boolean;

type _Compare<A extends number, B extends number, E extends boolean> =
    Or<Extends<A, 0>, Extends<B, 0>> extends true
    ? Eq<A, B> extends true ? E : Extends<A, 0>
    : _Compare<Prev<A>, Prev<B>, E>;
