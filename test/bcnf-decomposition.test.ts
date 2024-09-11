import { FunctionalDependency } from "../src/FunctionalDependency";
import { FunctionalDependencySet } from "../src/FunctionalDependencySet";
import { RelationalSchema } from "../src/RelationalSchema";
import { Utils } from "../src/Utils";

describe('BCNF decomposition', () => {
    it('should compute correct BCNF decomposition (1)', () => {
        const relationalSchema: RelationalSchema = new RelationalSchema(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['b', 'c']), new Set('e')),
            new FunctionalDependency(new Set(['c']), new Set(['d', 'a'])),
            new FunctionalDependency(new Set(['a']), new Set(['b'])),
        ]);
        const expectedRelationalSchemas: RelationalSchema[] = [
            new RelationalSchema(['a', 'b']),
            new RelationalSchema(['a', 'c', 'd', 'e']),
        ]

        const res = Utils.bcnfDecomposition(relationalSchema, fds);

        expect(res.every(r => expectedRelationalSchemas.some(r2 => r.equals(r2)))).toBeTruthy();
    })

    it('should compute correct BCNF decomposition (2)', () => {
        const relationalSchema: RelationalSchema = new RelationalSchema(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a']), new Set(['c', 'd'])),
            new FunctionalDependency(new Set(['b']), new Set(['c', 'e'])),
            new FunctionalDependency(new Set(['e']), new Set(['b'])),
        ]);
        const expectedRelationalSchemas: RelationalSchema[] = [
            new RelationalSchema(['a', 'e']),
            new RelationalSchema(['b', 'e']),
            new RelationalSchema(['a', 'c', 'd']),
        ]

        const res = Utils.bcnfDecomposition(relationalSchema, fds);
        
        expect(res.every(r => expectedRelationalSchemas.some(r2 => r.equals(r2)))).toBeTruthy();
    })

    it('should compute correct BCNF decomposition (3)', () => {
        const relationalSchema = new RelationalSchema(['A0', 'A1', 'A2', 'A3', 'A4', 'A5']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A0', 'A4']), new Set(['A2', 'A3'])),
            new FunctionalDependency(new Set(['A0', 'A2', 'A3']), new Set(['A1', 'A4'])),
            new FunctionalDependency(new Set(['A1']), new Set(['A5'])),
            new FunctionalDependency(new Set(['A5']), new Set(['A1'])),
        ])
        
        const expectedRelationalSchemas: RelationalSchema[] = [
            new RelationalSchema(['A1', 'A5']),
            new RelationalSchema(['A0', 'A1', 'A2', 'A3', 'A4']),
        ]
        console.time('Execution Time');
        const res = Utils.bcnfDecomposition(relationalSchema, fds);
        console.timeEnd('Execution Time');

        expect(res.every(r => expectedRelationalSchemas.some(r2 => r.equals(r2)))).toBeTruthy();
    })
});