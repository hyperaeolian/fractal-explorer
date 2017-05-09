export default class Complex {
    constructor(realOrComplex, imag){
        let isComplex = realOrComplex instanceof Complex;
        this._real = isComplex ? realOrComplex.real() : realOrComplex;
        this._imag = isComplex ? realOrComplex.imag() : imag;
    }

    _performChecks(value){
        if (!(value instanceof Complex)){
            throw `${value} is not a complex number.`;
        }

        if (value.real() === null || value.imag() === null){
            throw `Complex number ${value.toString()} does not have a valid real and/or imaginary component`;
        }
    }

    _doOperation(num, operation, exponent=null){
        this._performChecks(num);
        let real;
        let imag;
        switch (operation){
            case '+':
                real = this._real + num.real();
                imag = this._imag + num.imag();
                break;
            case '-':
                real = this._real - num.real();
                imag = this._imag - num.imag();
                break;
            case '*':
                real = this._real * num.real() - this._imag * num.imag();
                imag = this._imag * num.real() + this._real * num.imag();
                break;
            case '^':
                real = Math.pow(this._real, exponent);
                imag = Math.pow(this._imag, exponent);
                break;
        }

        return Complex.of(real, imag);
    }

    static of(r, i){
        return new Complex(r, i);
    }

    real(){ return this._real; }

    imag(){ return this._imag; }

    add(num){
        return this._doOperation(num, '+');
    }

    subtract(num){
        return this._doOperation(num, '-');
    }

    multiply(num){
        return this._doOperation(num, '*');
    }

    divide(){
        throw `Division of complex numbers is not implemented`;
    }

    pow(exponent){
        return this._doOperation(this, '^', exponent);
    }

    magnitude(){
        let x = this.pow(2);
        return Math.sqrt(x.real() + x.imag());
    }

    toString(){
        return `(${this._real} + ${this._imag}i)`;
    }
}