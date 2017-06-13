export default class Complex {
    constructor(realOrComplex, imag){
        let isComplex = realOrComplex instanceof Complex;
        this._real = isComplex ? realOrComplex.real() : realOrComplex;
        this._imag = isComplex ? realOrComplex.imag() : imag;
    }

    _verifyIsComplexNumber(value){
        if (!(value instanceof Complex)){
            throw `${value} is not a complex number.`;
        }

        if (value.real() === null || value.imag() === null){
            throw `Complex number ${value.toString()} does not have a valid real and/or imaginary component`;
        }
    }

    static of(r, i){
        return new Complex(r, i);
    }

    real(){ return this._real; }

    imag(){ return this._imag; }

    add(operand){
        this._verifyIsComplexNumber(operand);
        return new Complex(
            this._real + operand.real(),
            this._imag + operand.imag()
        );
    }

    subtract(operand){
        this._verifyIsComplexNumber(operand);
        return new Complex(
            this._real - operand.real(),
            this._imag - operand.imag()
        );
    }

    multiply(operand){
        this._verifyIsComplexNumber(operand);
        return new Complex(
            this._real * operand.real() - this._imag * operand.imag(),
            this._imag * operand.real() + this._real * operand.imag()
        );
    }

    divide(){
        throw `Division of complex numbers is not implemented`;
    }

    pow(exp){
        // Returns a real number
        return Math.pow(this._real, exp) + Math.pow(this._imag, exp);
    }

    modulus(){
        // Returns the absolute value of this complex number
        return Math.sqrt(this.pow(2));
    }

    toString(){
        return `(${this._real} + ${this._imag}i)`;
    }
}