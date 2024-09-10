export class FunctionalDependency {
    determinant: Set<string>
    dependent: Set<string>

    constructor(determinant: Set<string>, dependent: Set<string>) {
        if (determinant.size === 0 || dependent.size === 0) {
            throw new Error('determinant or dependent cannot be empty sets')
        }
        this.determinant = new Set<string>(determinant);
        this.dependent = new Set<string>(dependent);
    }

    equals(fd: FunctionalDependency): boolean {
        return fd.determinant.size === this.determinant.size && fd.dependent.size === this.dependent.size &&
            [...this.determinant].every(el => fd.determinant.has(el)) && [...this.dependent].every(el => fd.dependent.has(el));
    }

    decompose(): FunctionalDependency[] {
        const res: FunctionalDependency[] = [];
        for (let dependentUnit of this.dependent) {
            res.push(new FunctionalDependency(this.determinant, new Set<string>([dependentUnit])));
        }
        return res;
    }
}