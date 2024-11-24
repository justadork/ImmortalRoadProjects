import { _decorator, Component, Node } from 'cc';
import { Watch } from '../../cc_module/rx/core/effect/Watch';
import { rx } from '../../cc_module/rx';
import { EffectOption } from '../../cc_module/rx/core/effect/type';
const { ccclass, property } = _decorator;

export class ComponentExtension extends Component {

  protected effects: Watch[] = []

  protected onDestroy(): void {
    this.autoIntervalSet.forEach(inter => clearInterval(inter))
    this.effects.forEach(effect => effect.active = false)
  }

  protected effect(callback: Function , option?: EffectOption): Watch {
    const watch = rx.effect(callback , option)
    this.effects.push(watch)
    return watch
  }

  private autoIntervalSet = new Set<number>()

  protected setAutoInterval(call: any , time?: number) {
    const inter = setInterval(call , time)
    this.autoIntervalSet.add(inter)
    return () => {
      clearInterval(inter)
      this.autoIntervalSet.delete(inter)
    }
  }

}


