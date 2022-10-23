import { TN } from 'foo/Foo-interface'

declare module 'foo/Foo-interface' {
    interface TN<V extends number> {
        T1: T1<V>
        T2: T2<V> // This breaks Foo's contract
        Id: Id<V> // This should not be allowed
    }
}

type T1<V extends number> = [V];
type T2<V extends number> = [V, '2'];
type Id<V> = V;