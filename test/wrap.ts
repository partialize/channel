import DoneCallback = jest.DoneCallback;

function wrap(func: (done: DoneCallback) => Promise<void>): (done: DoneCallback) => void {
  return (done) => {
    func(done).then();
  };
}

export default wrap;
