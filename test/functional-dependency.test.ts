import { FunctionalDependency } from '../src/FunctionalDependency'

describe('Functional dependency', () => {
    it('should not be able to create functional dependency with empty set', () => {
        expect(() => new FunctionalDependency(new Set(['A', 'X']), new Set())).toThrow();
    })

    it('should create equal functional dependencies', () => {
        const fd1 = new FunctionalDependency(new Set(['A', 'X']), new Set(['B', 'C', 'XX']));
        const fd2 = new FunctionalDependency(new Set(['X', 'A']), new Set(['B', 'XX', 'C']));

        const res = fd1.equals(fd2)

        expect(res).toBeTruthy();
    });


    it('should create different functional dependencies', () => {
        const fd1 = new FunctionalDependency(new Set(['A', 'X']), new Set(['B', 'C', 'XX']));
        const fd2 = new FunctionalDependency(new Set(['X', 'A']), new Set(['B', 'XY', 'C']));

        const res = fd1.equals(fd2)

        expect(res).toBeFalsy();
    })
})