const path  = require('path');
const {Worker} = require("worker_threads");

class WorkerMultiplexer {
  constructor(workerPath) {
    this.worker = new Worker(path.join(__dirname, workerPath));
  }

  async execute(context) {
    const { port1, port2 } = new MessageChannel();
    const promise = new Promise((res, rej) => {
      port1.on('message', (message) => {
        res(message)
      });
    })
    this.worker.postMessage({ port: port2, context }, [port2]);
    return promise
  }
}

const Channel1 = new WorkerMultiplexer('workers/worker.js')
const Channel2 = new WorkerMultiplexer('workers/worker2.js')

Channel1.execute([2,3])
  .then(data => {
    console.log('data 1',data)
  })
  .catch(err => {
    console.log('err',err)
  })

Channel2.execute([2,3,5])
  .then(data => {
    console.log('data 2',data)
  })
  .catch(err => {
    console.log('err',err)
  })




