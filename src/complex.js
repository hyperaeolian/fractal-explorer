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

    _doOperation(operand, operation){
        this._performChecks(operand);
        let real;
        let imag;
        switch (operation){
            case '+':
                real = this._real + operand.real();
                imag = this._imag + operand.imag();
                break;
            case '-':
                real = this._real - operand.real();
                imag = this._imag - operand.imag();
                break;
            case '*':
                real = this._real * operand.real() - this._imag * operand.imag();
                imag = this._imag * operand.real() + this._real * operand.imag();
                break;
        }

        return Complex.of(real, imag);
    }

    static of(r, i){
        return new Complex(r, i);
    }

    real(){ return this._real; }

    imag(){ return this._imag; }

    add(operand){
        return this._doOperation(operand, '+');
    }

    subtract(operand){
        return this._doOperation(operand, '-');
    }

    multiply(operand){
        return this._doOperation(operand, '*');
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