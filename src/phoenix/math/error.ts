export class MathError extends Error {
    constructor(message: string) {
        super(message)
    }
}

// Rules
export class DivideByZeroError extends MathError {
    constructor() {
        super("Divide by zero")
    }
}

// Dimensions
export class InvalidDimensionsError extends MathError {
    constructor(dimensions: number | number[]) {
        super(`Invalid Dimension${Array.isArray(dimensions) ? dimensions.length > 1 ? "s" : "" : ""}: ${Array.isArray(dimensions) ? dimensions.join(", ") : dimensions}`)
    }
}

export class UnequalDimensionsError extends MathError {
    constructor(dimensions1: number | number[], dimensions2: number | number[]) {
        super(`Inequal Dimensions: ${Array.isArray(dimensions1) ? dimensions1.join(", ") : dimensions1} !== ${Array.isArray(dimensions2) ? dimensions2.join(", ") : dimensions2}`)
    }
}