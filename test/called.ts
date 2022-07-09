function called(time: number, callback: () => unknown): () => void {
  let curr = 0;
  return () => {
    curr++;

    if (curr == time) {
      callback();
    }
  };
}

export default called;