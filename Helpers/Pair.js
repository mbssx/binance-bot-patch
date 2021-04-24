class Pair {
    constructor(base, quote) {
        this.base = base;
        this.quote = quote;
    }

    toString(glue = '') {
        return `${this.base}${glue}${this.quote}`;
    }

    reverse() {
        return new Pair(this.quote, this.base);
    }
}

module.exports = Pair;
