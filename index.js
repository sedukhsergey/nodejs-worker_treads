const path  = require('path');
const {Worker} = require("worker_threads");

class ComputedNumbersWorker {
  constructor(workerPath) {
    this.workerPath = workerPath;
  }

  async start(context) {
    let worker;
    const promise = new Promise((res, rej) => {
      worker = this.runWorker(path.join(__dirname, this.workerPath), (err, data) => {
        if (err) {
          return null;
        }
        res(data)
      });
    })
    worker.postMessage(context);
    return promise;
  }

  runWorker(path, cb, workerData = null) {
    const worker = new Worker(path, { workerData });

    worker.on('message', cb.bind(null, null));
    worker.on('error', cb);

    worker.on('exit', (exitCode) => {
      if (exitCode === 0) {
        return null;
      }

      return cb(new Error(`Worker has stopped with code ${exitCode}`));
    });

    return worker;
  }
}

const ComputedWorker = new ComputedNumbersWorker('workers/worker.js')
const ComputedWorker2 = new ComputedNumbersWorker('workers/worker2.js')

ComputedWorker.start([2,3])
  .then(data => {
    console.log('data',data)
  })
  .catch(err => {
    console.log('err',err)
  })

ComputedWorker2.start([2,3,5])
  .then(data => {
    console.log('data',data)
  })
  .catch(err => {
    console.log('err',err)
  })




