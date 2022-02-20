/**
 * @file 基于 @vue/reactivity 的反应性工具
 */
import { useRef, useState, useEffect, useReducer, EffectCallback } from 'react'
import {
  readonly,
  UnwrapRef,
  ref,
  reactive,
  effect,
  stop,
  ReactiveEffectRunner,
} from '@vue/reactivity'

type ForceUpdateRes = [number, (a?: number) => any]

// 强制更新
export const useForceUpdate = (): ForceUpdateRes => {
  const [forceIndex, _forceUpdate] = useReducer(
    (s: number, a: number | undefined) => a ?? s + 1,
    0,
  )
  const forceUpdate = (a?: number) => {
    _forceUpdate(a)
  }
  return [forceIndex, forceUpdate]
}

// 文件热更新 - 文件热更新时 依赖为空数组也会重新执行
export const useEffectHMR = (fn: (hmr: boolean) => EffectCallback | void) => {
  const initRef = useRef(true)
  useEffect(() => {
    const cleanup = fn(!initRef.current)
    if (initRef.current) {
      initRef.current = false
    }
    return () => {
      cleanup?.()
    }
  }, [])
}

const createInnerEffect = (
  fn: () => JSX.Element,
  forceUpdate: (a?: number) => void,
  lazy: boolean = true,
) => {
  const _effect = effect(fn, {
    lazy,
    scheduler() {
      forceUpdate()
    },
  })
  return _effect
}

/**
 * React 组件 结合 vue相应式数据，达到数据改变即会重新渲染组件的目的
 * 函数定义及灵感来源于：reactivue -> https://github.com/antfu/reactivue
 * @param setupFunction 用于返回 相应式的数据， ref, reactive 创建的数据
 * @param renderFunction 返回 JSX的 函数: 1. 返回jsx 2. 读取 setupFunction 返回的数据（依赖收集，当数据变动 重新出发 renderFunction 函数）
 * @returns
 *
 * @example
 *
 * const Counter = defineComponent(
 *   (props) => {
 *     const count = ref(props.value || 0);
 *     const increase = () => {
 *       count.value++;
 *     };
 *     const decrease = () => {
 *       count.value--;
 *     };
 *     // 组装相应式数据
 *     return {
 *       count,
 *       increase,
 *       decrease,
 *     };
 *   },
 *   ({ count, increase, decrease }) => {
 *     // 在 jsx中使用相应式数据
 *     return (
 *       <div style={{ margin: '5px' }}>
 *         <button onClick={decrease}>-</button>
 *         <button>{count}</button>
 *         <button onClick={increase}>+</button>
 *       </div>
 *     );
 *   },
 * );
 */
export const defineComponent = <PropsType, State>(
  setupFunction: (props: PropsType) => State,
  renderFunction: (state: UnwrapRef<State>) => JSX.Element,
): ((props: PropsType) => JSX.Element) => {
  return (props: PropsType) => {
    const createState = () => {
      const _props = reactive({ ...(props || {}) }) as any
      const setupState = setupFunction(readonly(_props))
      const data = ref(setupState)
      // console.log('before Mount ........', data.value);
      return data.value
    }

    const [state, setState] = useState(createState)
    const [, forceUpdate] = useForceUpdate()
    const effectRef = useRef<ReactiveEffectRunner>()

    let isHmr = false
    useEffectHMR(hmr => {
      if (hmr) {
        isHmr = true
        // console.log('hmr to update state....');
        setState(createState())
        Promise.resolve().then(() => (isHmr = true))
      }
    })

    useEffect(() => {
      if (isHmr) {
        // console.log('break once when HMR...');
        return
      }
      // console.log('create effect for tracking.....');
      effectRef.current = createInnerEffect(
        () => renderFunction(state),
        forceUpdate,
      )
      forceUpdate()
      return () => {
        // console.log('销毁.', effectRef.current?.effect);
        stop(effectRef.current!)
      }
    }, [state])

    return effectRef.current?.() || ''
  }
}
