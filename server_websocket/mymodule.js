/**
 * When we want to export a single class/variable/function from one module to another module,
 * we use module.exports way.
 */

class Artimatics {
    constructor(a, b) {
        this.a = Number(a);
        this.b = Number(b);
    }

    add() {
        return this.a + this.b;
    }
    subtract() {
        return this.a - this.b;
    }

    multiply() {
        return this.a * this.b;
    }

    divide() {
        if (this.b != 0) {
            return this.a / this.b;
        }
        return "divided by zero !!!!";
    }
}

module.exports = Artimatics;

/* or export this way */
// module.exports = class Artimatics { ... }