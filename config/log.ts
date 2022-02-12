const queue: Set<any> = new Set()

// incase when config file merge log twice
let init = true

const runLogs = () => {
  for (const text of queue) {
    console.log(text)
  }
}

export const log = (...msg: any[]) => {
  queue.add(msg.join(' '))
  if (!init) {
    runLogs()
    return
  }
  clearTimeout((global as any).___timer)
  ;(global as any).___timer = setTimeout(() => {
    runLogs()
    init = false
  }, 80)
}
