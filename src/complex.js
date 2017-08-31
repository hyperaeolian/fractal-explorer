export default class Complex {
    constructor(realOrComplex, imag){
        let isComplex = realOrComplex instanceof Complex;
        this._real = isComplex ? realOrComplex.real() : realOrComplex;
        this._imag = isComplex ? realOrComplex.imag() : imag;
        this._pow2 = this.pow(2);
    }

    isComplexNumber(value){
        return value instanceof Complex;
    }

    static of(r, i){
        return new Complex(r, i);
    }

    real(){ return this._real; }

    imag(){ return this._imag; }

    add(operand){
        if (this.isComplexNumber(operand)){
            return new Complex(
                this._real + operand.real(),
                this._imag + operand.imag()
            );
        }
    }

    subtract(operand){
        throw `Subtraction of Complex numbers is not implemented.`
    }

    multiply(operand){
        if (this.isComplexNumber(operand)){
            return new Complex(
                this._real * operand.real() - this._imag * operand.imag(),
                this._imag * operand.real() + this._real * operand.imag()
            );
        }
        return null;
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
        return Math.sqrt(this._pow2);
    }

    toString(){
        return `(${this._real} + ${this._imag}i)`;
    }
}