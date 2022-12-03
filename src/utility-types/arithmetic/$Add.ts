import { Type, A, B } from 'free-types-core';
import { Add } from '../../essential/utils';
import { $Optional } from '../../essential/adapters/$Optional';

export {Add, $Add }

type $Add<T extends number = never> = $Optional<$Add2, [T]>;

interface $Add2 extends Type<[number, number]> {
    type: Add<A<this>, B<this>>
}
