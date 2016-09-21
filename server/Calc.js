class Calc {
  static getAverage(itens) {
    return itens.reduce((p, c) => p + c, 0) / itens.length;
  }

  static getMode(itens) {
    itens = itens.map((v) => Math.round(v));
    let dict = {}
      , greatestFreq = -1
      , mode;

    itens.map((item) => {
      if (dict[item]) {
        dict[item] = dict[item] + 1;
      } else {
        dict[item] = 1;
      }
    });

    for(let key in dict) {
      if(dict[key] > greatestFreq){
          greatestFreq = dict[key];
          mode = key;
      }
    }

    return parseInt(mode);
  }

  static getVariance(itens, average) {
    return itens.reduce((p, c) => {
      return p + Math.pow(c - average, 2);
    }, 0) / itens.length;
  }

  static getMedian(itens) {
    itens = itens.map((v) => Math.round(v));
    let middle = Math.floor(itens.length / 2);
    return itens[middle];
  }

  static getDeviation(variance) {
    let deviation = Math.sqrt(variance);
    if (deviation < 0) {
      deviation = deviation * -1;
    }
    return deviation;
  }
}

export default Calc;
