const util = {
  getChunks: (k, sequence) => {
    if (0 !== sequence.length % k) throw `Input length must be a multiple of ${k}.`;
    const chunks = [];
    for (let i = 0; i < sequence.length; i += k) {
      chunks.push(sequence.slice(i, i + k));
    }
    return chunks;
  },
};
