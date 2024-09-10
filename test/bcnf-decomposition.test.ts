import { FunctionalDependency } from "../src/FunctionalDependency";
import { FunctionalDependencySet } from "../src/FunctionalDependencySet";
import { RelationalScheme } from "../src/RelationalScheme";
import { Utils } from "../src/Utils";

describe('BCNF decomposition', () => {
    it('should compute correct BCNF decomposition (1)', () => {
        const relationalScheme: RelationalScheme = new RelationalScheme(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['b', 'c']), new Set('e')),
            new FunctionalDependency(new Set(['c']), new Set(['d', 'a'])),
            new FunctionalDependency(new Set(['a']), new Set(['b'])),
        ]);
        const expectedRelationalSchemes: RelationalScheme[] = [
            new RelationalScheme(['a', 'b']),
            new RelationalScheme(['a', 'c', 'd', 'e']),
        ]

        const res = Utils.bcnfDecomposition(relationalScheme, fds);
        console.log(res)
        expect(res.every(r => expectedRelationalSchemes.some(r2 => r.equals(r2)))).toBeTruthy();
    })

    it('should compute correct BCNF decomposition (2)', () => {
        const relationalScheme: RelationalScheme = new RelationalScheme(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a']), new Set(['c', 'd'])),
            new FunctionalDependency(new Set(['b']), new Set(['c', 'e'])),
            new FunctionalDependency(new Set(['e']), new Set(['b'])),
        ]);
        const expectedRelationalSchemes: RelationalScheme[] = [
            new RelationalScheme(['a', 'e']),
            new RelationalScheme(['b', 'e']),
            new RelationalScheme(['a', 'c', 'd']),
        ]

        const res = Utils.bcnfDecomposition(relationalScheme, fds);

        expect(res.every(r => expectedRelationalSchemes.some(r2 => r.equals(r2)))).toBeTruthy();
    })

    it.only('should compute correct BCNF decomposition (3)', () => {
        const relationalScheme = new RelationalScheme(['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A0', 'A4']), new Set(['A2', 'A3'])),
            new FunctionalDependency(new Set(['A0', 'A2', 'A3']), new Set(['A1', 'A4'])),
            new FunctionalDependency(new Set(['A1']), new Set(['A5'])),
            new FunctionalDependency(new Set(['A5']), new Set(['A1'])),
        ])
        
        const expectedRelationalSchemes: RelationalScheme[] = [
            new RelationalScheme(['A1', 'A5']),
            new RelationalScheme(['A0', 'A1', 'A2', 'A3', 'A4']),
        ]
        console.time('Execution Time');
        const res = Utils.bcnfDecomposition(relationalScheme, fds);
        console.timeEnd('Execution Time');

        expect(res.every(r => expectedRelationalSchemes.some(r2 => r.equals(r2)))).toBeTruthy();
    })
});