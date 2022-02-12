/**
 * @file 运行时配置: https://v2.umijs.org/zh/guide/runtime-config.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%9C%89%E8%BF%90%E8%A1%8C%E6%97%B6%E9%85%8D%E7%BD%AE%EF%BC%9F
 */

// export function patchRoutes(routes: any[]) {
//   routes[0].unshift({
//     path: '/foo',
//     component: require('./routes/foo').default,
//   });
// }

export function render(oldRender: () => void) {
  oldRender()
  // setTimeout(oldRender, 1000);
}

// export function onRouteChange({ location, routes, action }) {
//   bacon(location.pathname);
// }

// ------ include mock proxy config --------
if (MSW_MOCK) {
  if (MSW_MOCK === 2) {
    console.log(
      'mock start: 拦截部分接口，请给接口url上附着 __mock 参数，如：/api/list?__mock',
    )
  } else {
    console.log('mock start: 拦截所有 /api 开头的 url')
  }
  import('../msw/browser')
    .then(({ worker }) => {
      worker.start()
      console.log('mock load success')
    })
    .catch(e => {
      console.warn('mock load fail', e)
    })
}
