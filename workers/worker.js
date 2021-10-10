const { parentPort } = require('worker_threads');

parentPort.on('message', (array) => {
  const sum = array.reduce((acc, curr) => acc + curr, 0 )
  parentPort.postMessage(sum);
});
