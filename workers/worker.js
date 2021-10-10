const { parentPort } = require('worker_threads');

parentPort.on('message', ({context, port}) => {
  const sum = context.reduce((acc, curr) => acc + curr, 0 )
  port.postMessage(sum);
});
