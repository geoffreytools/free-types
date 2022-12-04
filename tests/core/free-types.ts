import { test } from 'ts-spec';
import { free, partialRight } from '../../core'
import { Lift, MapOver } from '../../essential/mappables'


type URLs = {
    A: 'https://foo'
    B: 'https://bar'
}

type Responses = {
    A: { foo: number } 
    B: { bar: number }
}

type Queries = Lift<free.UnaryFunction, [URLs, Responses]>
type QueriesResult = {
    A: (a: "https://foo") => { foo: number };
    B: (a: "https://bar") => { bar: number };
}

type Commands = MapOver<URLs, partialRight<free.UnaryFunction, [void]>>
type CommandsResult = {
    A: (a: "https://foo") => void;
    B: (a: "https://bar") => void;
}

test('UnaryFunction' as const, t => [
    t.equal<Queries, QueriesResult>(),
    t.equal<Commands, CommandsResult>()
])