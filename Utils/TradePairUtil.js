const Pair = require("../Helpers/Pair");

class TradePairUtil {
    cleanSymbol(symbol) {
        return symbol.toUpperCase();
    }

    parseSinglePair(pair, pairGlue = '-') {
        const [base, quote] = pair.split(pairGlue).map(symbol => {
            return this.cleanSymbol(symbol);
        })

        return new Pair(base, quote);
    }

    parsePairList(list, listGlue = ',', pairGlue = '-') {
        const pairs = list.split(listGlue);

        return pairs.map(pair => {
            return this.parseSinglePair(pair, pairGlue);
        })
    }
}

module.exports = new TradePairUtil;
