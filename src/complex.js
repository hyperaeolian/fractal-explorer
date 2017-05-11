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

    _doOperation(num, operation){
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
        }

        return Complex.of(real, imag);
    }

    static of(r, i){
        return new Complex(r, i);
    }

    real(){ return this._real; }

    imag(){ return this._imag; }

    setReal(value){
    	this._real = value;
    }

    setImag(value){
    	this._imag = value;
    }

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

    magnitude(){
        return Math.sqrt(
        	this.real() * this.real() + this.imag() * this.imag()
        );
    }

    toString(){
        return `(${this._real} + ${this._imag}i)`;
    }
}