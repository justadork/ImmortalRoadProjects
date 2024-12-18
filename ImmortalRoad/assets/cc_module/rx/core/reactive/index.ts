import {HAS_PROXY_KEY, HAS_PROXY_OBJECT, REACTIVE_TO_WATCH} from "./cache";
import {getCurrentWatch} from "../effect/cache";
import { ReactiveOptions } from "./type";
import { Watch } from "../effect/Watch";

export function reactive<T extends object>(o: T , options: ReactiveOptions = {}): T {
  // 该对象是否已经被代理过了
  let proxy = HAS_PROXY_OBJECT.get(o)
  if (proxy) return proxy
  // 如果已经代理过了就直接返回
  if (!!(o as any)[HAS_PROXY_KEY]) return o
  // 创建新代理
  proxy = new Proxy(o , {
    get(target: T, p: string | symbol, receiver: any): any {
      const result = Reflect.get(target , p , receiver)
      // 收集对应的watch
      const currentWatch = getCurrentWatch()
      if (currentWatch !== null) {
        let map = REACTIVE_TO_WATCH.get(target)
        if (!map) {
          map = new Map
          REACTIVE_TO_WATCH.set(target , map)
        }
        let set = map.get(p as string)
        if (!set) {
          set = new Set
          map.set(p as string , set)
        }
        set.add(currentWatch)
        currentWatch.__allDep.add(set)
      }
      if (typeof result === 'object' && result) return reactive(result , options)
      else return result
    },
    set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
      const oldValue = (target as any)[p]
      const result = Reflect.set(target , p , newValue , receiver)
      if (options.watch) options.watch(target , p , newValue , oldValue)
      // 执行对应的watch
      if (newValue !== oldValue || options.forceUpdate) {
        let map = REACTIVE_TO_WATCH.get(target)
        if (!map) return result
        let set = map.get(p as string)
        if (!set) return result;
        [...set].forEach(w => w.notify())
      }
      return result
    },
  })
  HAS_PROXY_OBJECT.set(o , proxy)
  return proxy
}