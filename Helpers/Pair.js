class Pair {
    constructor(base, quote) {
        this.base = base;
        this.quote = quote;
    }

    toString() {
        return `${this.base}${this.quote}`;
    }

    reverse() {
        return new Pair(this.quote, this.base);
    }
}

module.exports = Pair;
