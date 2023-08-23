
const depositQueue = [];

const enqueueDepositRequest = (request) => {
  depositQueue.push(request);
};

const dequeueDepositRequest = () => {
  return depositQueue.shift();
};

const getDepositQueue = () => {
  return depositQueue;
};

export { enqueueDepositRequest, dequeueDepositRequest, getDepositQueue };
