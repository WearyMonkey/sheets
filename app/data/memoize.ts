import { Iterable } from 'immutable';

type Collection<K, V> = Iterable<K, V>
type Mapper<K, V0, V, V2> = (v: V, k: K) => V2;
type KeyMapper<K, V0, V, V2, V3> = (v: V, k: K, o: V3) => V2;
type Memoized<K, V0, V> = (v: Collection<K, V0>) => Collection<K, V>

interface Chain<K, V0, V> {
  map<V2>(m : Mapper<K, V0, V, V2>): Chain<K, V0, V2>
  map<K1 extends keyof V, V2>(key: K1, m : KeyMapper<K, V0, V[K1], V, V2>): Chain<K, V0, V2>
  flatMap<V2>(m : Mapper<K, V0, V, Collection<K, V2>>) : Chain<K, V0, V2>
  build() : (v: V0) => Memoized<K, V0, V>
}

export function memoizer<K, V, V2>(mapper: Mapper<K, V, V, V2>) : Chain<K, V, V2> {
  return null;
}


function foo<T, K extends keyof T>(k : K, t : T) : T[K] {
  return t[k];
}