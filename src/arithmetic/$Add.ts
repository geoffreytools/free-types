import { Type, A, B } from 'core';
import { Add } from 'utils';
import { $Optional } from 'adapters/$Optional';

export {Add, $Add }

type $Add<T extends number = never> = $Optional<$Add2, [T]>;

interface $Add2 extends Type<[number, number]> {
    type: Add<A<this>, B<this>>
}
