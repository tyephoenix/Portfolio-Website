import { Tensor } from "./tensor";
import { Vector } from "./vector";

export class Matrix extends Tensor {

    constructor(components: number[][]) {
        super([components.length, components[0].length], components.flat())
    }

    get rows(): number {
        return this.dimensions[0]
    }
    get columns(): number {
        return this.dimensions[1]
    }
    get T(): Matrix {
        const data = []
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                data.push(this.get(j, i))
            }
        }
        return new Matrix([data])
    }

    get(row: number, column: number): number {
        return super.get(row, column)
    }

    set(rowColumn: [number, number], value: number): void {
        super.set(rowColumn, value)
    }

    row(row: number): Vector {
        const data = []
        for (let i = 0; i < this.columns; i++) {
            data.push(this.get(row, i))
        }
        return new Vector(...data)
    }

    column(column: number): Vector {
        const data = []
        for (let i = 0; i < this.rows; i++) {
            data.push(this.get(i, column))
        }
        return new Vector(...data)
    }

    dot(other: Matrix): Matrix {
        const tensor = super.contract(other, 0, 0)
        const data = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                data.push(tensor.get(i, j))
            }
        }
        return new Matrix([data])
    }

    apply(vector: Vector): Vector {
        const tensor = super.contract(vector, 0, 0)
        const data = []
        for (let i = 0; i < this.rows; i++) {
            data.push(tensor.get(i, 0))
        }
        return new Vector(...data)
    }

    clone(): Matrix {
        const data = []
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                data.push(this.get(i, j))
            }
        }
        return new Matrix([data])
    }

    toString() {
        const rows = []
        for (let i = 0; i < this.rows; i++) {
            const row = []
            for (let j = 0; j < this.columns; j++) {
                row.push(this.get(i, j))
            }
            rows.push(row.join(", "))
        }
        return `Matrix(${rows.join("\n")})`
    }

    static identity(size: number): Matrix {
        return new Matrix(Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => i === j ? 1 : 0)))
    }

    static zero(rows: number, columns: number): Matrix {
        return new Matrix(Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0)))
    }

    static rotation(size: number, phi: number, i: number, j: number): Matrix {
        const matrix = Matrix.identity(size)

        const cos = Math.cos(phi)
        const sin = Math.sin(phi)

        matrix.set([i, i], cos)
        matrix.set([i, j], sin)
        matrix.set([j, i], -sin)
        matrix.set([j, j], cos)

        return matrix
    }

    static random(rows: number, columns: number): Matrix {
        return new Matrix(Array.from({ length: rows }, () => Array.from({ length: columns }, () => Math.random())))
    }
}

export class Matrix2 extends Matrix {
    get m00() {
        return this.get(0, 0)
    }
    get m01() {
        return this.get(0, 1)
    }
    get m10() {
        return this.get(1, 0)
    }
    get m11() {
        return this.get(1, 1)
    }

    constructor(components: [[number, number], [number, number]]) {
        super(components)
    }
}

export class Matrix3 extends Matrix {
    get m00() {
        return this.get(0, 0)
    }
    get m01() {
        return this.get(0, 1)
    }
    get m02() {
        return this.get(0, 2)
    }
    get m10() {
        return this.get(1, 0)
    }
    get m11() {
        return this.get(1, 1)
    }
    get m12() {
        return this.get(1, 2)
    }
    get m20() {
        return this.get(2, 0)
    }
    get m21() {
        return this.get(2, 1)
    }
    get m22() {
        return this.get(2, 2)
    }

    constructor(components: [[number, number, number], [number, number, number], [number, number, number]]) {
        super(components)
    }
}

export class Matrix4 extends Matrix {
    get m00() {
        return this.get(0, 0)
    }
    get m01() {
        return this.get(0, 1)
    }
    get m02() {
        return this.get(0, 2)
    }
    get m03() {
        return this.get(0, 3)
    }
    get m10() {
        return this.get(1, 0)
    }
    get m11() {
        return this.get(1, 1)
    }
    get m12() {
        return this.get(1, 2)
    }
    get m13() {
        return this.get(1, 3)
    }
    get m20() {
        return this.get(2, 0)
    }
    get m21() {
        return this.get(2, 1)
    }
    get m22() {
        return this.get(2, 2)
    }
    get m23() {
        return this.get(2, 3)
    }
    get m30() {
        return this.get(3, 0)
    }
    get m31() {
        return this.get(3, 1)
    }
    get m32() {
        return this.get(3, 2)
    }
    get m33() {
        return this.get(3, 3)
    }

    constructor(components: [[number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number]]) {
        super(components)
    }
}