import { DivideByZeroError, InvalidDimensionsError, MathError, UnequalDimensionsError } from "../error"

export class Tensor {
    
    readonly dimensions: number[]
    protected data: number[]

    index(indices: number[]): number {
        return indices.reduce((a, b, i) => a + b * this.dimensions.slice(i + 1).reduce((a, b) => a * b, 1), 0)
    }

    constructor(dimensions: number[], components?: number[]) {
        if (dimensions.length === 0) {
            throw new InvalidDimensionsError([0])
        }
        if (dimensions.some(d => d <= 0)) {
            throw new InvalidDimensionsError(dimensions)
        }
        if (components && components.length !== dimensions.reduce((a, b) => a * b, 1)) {
            throw new InvalidDimensionsError(dimensions)
        }
        this.dimensions = dimensions
        this.data = components ?? new Array(dimensions.reduce((a, b) => a * b, 1)).fill(0)
    }

    get(...indices: number[]): number {
        if (indices.length !== this.dimensions.length) {
            throw new UnequalDimensionsError(indices.length, this.dimensions.length)
        }
        return this.data[this.index(indices)]
    }

    set(indices: number[], value: number): void {
        if (indices.length !== this.dimensions.length) {
            throw new UnequalDimensionsError(indices.length, this.dimensions.length)
        }
        this.data[this.index(indices)] = value
    }

    /**
     * Add the other tensor to this tensor in place.
     * 
     * @param other - The tensor to add to this tensor.
     * @throws {UnequalDimensionsError} If the dimensions of the other tensor are not equal to the dimensions of this tensor.
     */
    add(other: Tensor | number[]): void {
        if (other instanceof Tensor && this.dimensions !== other.dimensions) {
            throw new UnequalDimensionsError(this.dimensions, other.dimensions)
        }
        if (Array.isArray(other)) {
            if (other.length !== this.dimensions.length) {
                throw new UnequalDimensionsError(other.length, this.dimensions.length)
            }
        }
        this.data.forEach((c, i) => this.data[i] = c + (Array.isArray(other) ? other[i] : other.data[i]))
    }

    /**
     * Subtract the other tensor from this tensor in place.
     * 
     * @param other - The tensor to subtract from this tensor.
     * @throws {UnequalDimensionsError} If the dimensions of the other tensor are not equal to the dimensions of this tensor.
     */
    subtract(other: Tensor): void {
        if (this.dimensions !== other.dimensions) {
            throw new UnequalDimensionsError(this.dimensions, other.dimensions)
        }
        this.data.forEach((c, i) => this.data[i] = c - other.data[i])
    }

    /**
     * Scale the tensor by a scalar in place.
     * 
     * @param scalar - The scalar to scale the tensor by.
     */
    scale(scalar: number): void {
        this.data.forEach((c, i) => this.data[i] = c * scalar)
    }

    /**
     * Normalize the tensor in place.
     * 
     * @throws {DivideByZeroError} If the magnitude of the tensor is zero.
     */
    normalize(): void {
        const magnitude = this.magnitude()
        if (magnitude === 0) {
            throw new DivideByZeroError()
        }
        this.scale(1 / magnitude)
    }

    /**
     * Contract the tensor with the other tensor along the given axes.
     * 
     * @param other - The tensor to contract with.
     * @param axisSelf - The axis along which to contract this tensor.
     * @param axisOther - The axis along which to contract the other tensor.
     * @returns The contracted tensor.
     * @throws {InvalidDimensionsError} If the axes are not valid.
     * @throws {UnequalDimensionsError} If the dimensions of the tensors are not equal along the given axes.
     */
    contract(other: Tensor, axisSelf: number, axisOther: number): Tensor {
        if (axisSelf < 0 || axisSelf >= this.dimensions.length) {
            throw new InvalidDimensionsError([axisSelf])
        }
        if (axisOther < 0 || axisOther >= other.dimensions.length) {
            throw new InvalidDimensionsError([axisOther])
        }
        if (this.dimensions[axisSelf] !== other.dimensions[axisOther]) {
            throw new UnequalDimensionsError(this.dimensions, other.dimensions);
        }
    
        const resultDims = [
            ...this.dimensions.slice(0, axisSelf),
            ...this.dimensions.slice(axisSelf + 1),
            ...other.dimensions.slice(0, axisOther),
            ...other.dimensions.slice(axisOther + 1),
        ];
    
        const result = new Tensor(resultDims)
    
        const contractedSize = this.dimensions[axisSelf]
    
        const recurse = (acc: number[]) => {
            if (acc.length === resultDims.length) {
                let sum = 0
    
                for (let k = 0; k < contractedSize; k++) {
                    let idxA: number[] = []
                    {
                        let r = 0
                        for (let i = 0; i < this.dimensions.length; i++) {
                            if (i === axisSelf) {
                                idxA.push(k)
                            } else {
                                idxA.push(acc[r++])
                            }
                        }
                    }
    
                    let idxB: number[] = []
                    {
                        let ri = 0;
                        for (let j = 0; j < other.dimensions.length; j++) {
                            if (j === axisOther) {
                                idxB.push(k)
                            } else {
                                const accIndex =
                                    (ri < axisSelf)
                                        ? ri
                                        : ri + 1
                                idxB.push(acc[accIndex])
                                ri++
                            }
                        }
                    }
    
                    sum += this.get(...idxA) * other.get(...idxB)
                }
    
                result.set(acc, sum)
                return
            }
    
            const dim = resultDims[acc.length]
            for (let i = 0; i < dim; i++) {
                recurse([...acc, i])
            }
        }
    
        recurse([])
    
        return result
    }

    /**
     * Squeeze the tensor to remove all dimensions of size 1.
     * 
     * @returns The squeezed tensor.
     */
    squeeze(): Tensor {
        const newDims = this.dimensions.filter(d => d !== 1)
    
        if (newDims.length === this.dimensions.length) {
            return this.clone()
        }
    
        const out = new Tensor(newDims)
    
        for (let i = 0; i < out.data.length; i++) {
            const outIdx = []
    
            let r = i
            for (let d = 0; d < newDims.length; d++) {
                const stride = newDims.slice(d + 1).reduce((a, b) => a * b, 1) || 1
                outIdx.push(Math.floor(r / stride))
                r %= stride
            }
    
            const inIdx: number[] = []
            let p = 0
            for (let d = 0; d < this.dimensions.length; d++) {
                if (this.dimensions[d] === 1) {
                    inIdx.push(0)
                } else {
                    inIdx.push(outIdx[p++])
                }
            }
    
            out.data[i] = this.get(...inIdx)
        }
    
        return out
    }

    /**
     * Compute the Frobenius norm of the tensor.
     * 
     * @returns The Frobenius norm of the tensor.
     */
    magnitude(): number {
        return Math.sqrt(this.data.reduce((a, b) => a + b * b, 0))
    }

    /**
     * Transpose the tensor according to the given order.
     * 
     * @param order - The order to transpose the tensor according to.
     * @returns The transposed tensor.
     * @throws {UnequalDimensionsError} If the order is not equal to the dimensions of the tensor.
     * @throws {MathError} If the order is not a permutation.
     */
    transpose(...order: number[]): Tensor {
        if (order.length !== this.dimensions.length) {
            throw new UnequalDimensionsError(order.length, this.dimensions.length)
        }
    
        const sorted = [...order].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i] !== i) {
                throw new MathError("Transpose order must be a permutation")
            }
        }
    
        const newDims = order.map(i => this.dimensions[i])
        const out = new Tensor(newDims)
    
        for (let i = 0; i < out.data.length; i++) {
            const outIdx = []
            let r = i
    
            for (let d = 0; d < newDims.length; d++) {
                const stride = newDims.slice(d + 1).reduce((a, b) => a * b, 1) || 1
                outIdx.push(Math.floor(r / stride))
                r %= stride
            }
    
            const inIdx = []
            for (let d = 0; d < order.length; d++) {
                inIdx[order[d]] = outIdx[d]
            }
    
            out.data[i] = this.get(...inIdx)
        }
    
        return out
    }

    /**
     * Slice the tensor along the given specifications.
     * 
     * @param specifications - The specifications to slice the tensor along.
     * @returns The sliced tensor.
     * @throws {UnequalDimensionsError} If the specifications are not equal to the dimensions of the tensor.
     * @throws {MathError} If the slice specification is invalid.
     */
    slice(...specifications: (number | number[] | undefined)[]): Tensor {
        if (specifications.length !== this.dimensions.length) {
            throw new UnequalDimensionsError(specifications.length, this.dimensions.length)
        }
    
        const outDims: number[] = [];
        const map: { type: "all" | "range" | "fixed"; dim: number; start?: number }[] = []
    
        for (let i = 0; i < specifications.length; i++) {
            const s = specifications[i]
    
            if (typeof s === "number") {
                map.push({ type: "fixed", dim: i })
            } else if (s === undefined) {
                outDims.push(this.dimensions[i])
                map.push({ type: "all", dim: i })
            } else if (Array.isArray(s)) {
                const [start, end] = s
                if (
                    start < 0 || end < 0 ||
                    start >= end ||
                    end > this.dimensions[i]
                ) {
                    throw new MathError(`Invalid slice range [${start}, ${end}] for dim=${i}`)
                }
                outDims.push(end - start)
                map.push({ type: "range", dim: i, start })
            } else {
                throw new MathError("Invalid slice specification " + s)
            }
        }
    
        const out = new Tensor(outDims)
        const outSize = out.data.length
    
        for (let flat = 0; flat < outSize; flat++) {
            const outIdx: number[] = []
            let r = flat
            for (let d = 0; d < outDims.length; d++) {
                const stride = outDims.slice(d + 1).reduce((a, b) => a * b, 1) || 1
                outIdx.push(Math.floor(r / stride))
                r %= stride
            }
    
            const inIdx: number[] = []
            let outPtr = 0
    
            for (let i = 0; i < map.length; i++) {
                const entry = map[i]
    
                if (entry.type === "fixed") {
                    inIdx.push(specifications[i] as number)
                } 
                else if (entry.type === "all") {
                    inIdx.push(outIdx[outPtr++])
                } 
                else if (entry.type === "range") {
                    inIdx.push(outIdx[outPtr++] + (entry.start as number))
                }
            }
    
            out.data[flat] = this.get(...inIdx)
        }
    
        return out
    }

    /**
     * Pick the tensor along the given dimension and index.
     * 
     * @param dimension - The dimension to pick the tensor along.
     * @param index - The index to pick the tensor along.
     * @returns The picked tensor.
     * @throws {InvalidDimensionsError} If the dimension is not valid.
     * @throws {InvalidDimensionsError} If the index is not valid.
     */
    pick(dimension: number, index: number): Tensor {
        if (dimension < 0 || dimension >= this.dimensions.length) {
            throw new InvalidDimensionsError(dimension)
        }
        if (index < 0 || index >= this.dimensions[dimension]) {
            throw new InvalidDimensionsError([index, this.dimensions[dimension]])
        }
    
        const spec = this.dimensions.map((_, d) =>
            d === dimension ? index : undefined
        )
    
        return this.slice(...spec)
    }

    clone(): Tensor {
        return new Tensor([...this.dimensions], [...this.data])
    }

    toString() {
        return `Tensor(${this.dimensions.join(", ")})`
    }
}