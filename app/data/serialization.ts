import { observable, ObservableMap } from 'mobx';

export function mapToJson<V>(map: ObservableMap<V>, valueToJson: (v: V) => JSON): [string, JSON][] {
  return Array.from(map.entries()).map(([k, v]) => {
    const record: [string, JSON] = [k, valueToJson(v)];
    return record;
  });
}

export function mapFromJson<V>(records: [string, JSON][], valueFromJson: (json: JSON) => V): ObservableMap<V> {
  const map: [string, V][] = records.map(([k, j]) => {
    const entry: [string, V] = [k, valueFromJson(j)];
    return entry;
  });
  return observable.map<V>(map);
}