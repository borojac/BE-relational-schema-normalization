import { FunctionalDependency } from "../src/FunctionalDependency";
import { FunctionalDependencySet } from "../src/FunctionalDependencySet";
import { RelationalScheme } from "../src/RelationalScheme";
import { Utils } from "../src/Utils";

describe('Syntesis algorithm for 3NF', () => {
    it('should compute correct relational schemes for 3nd (1)', () => {
        const relationalScheme: RelationalScheme = new RelationalScheme(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a', 'b']), new Set('c')),
            new FunctionalDependency(new Set(['a', 'b']), new Set(['e'])),
            new FunctionalDependency(new Set(['c']), new Set(['d'])),
            new FunctionalDependency(new Set(['e']), new Set('a')),
        ]);
        const expectedRelationalSchemes: RelationalScheme[] = [
            new RelationalScheme(['a', 'b', 'c', 'e']),
            new RelationalScheme(['c', 'd']),
            new RelationalScheme(['a', 'e'])
        ]

        const res = Utils.syntesisAlgorithmFor3NF(relationalScheme, fds);

        expect(res.every(r => expectedRelationalSchemes.some(r2 => r.equals(r2)))).toBeTruthy();
    });

    it('should compute correct relational schemes for 3nd (2)', () => {
        const relationalScheme = new RelationalScheme(['A0', 'A1', 'A2', 'A3', 'A4']);
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
    
        const res = Utils.syntesisAlgorithmFor3NF(relationalScheme, fds);

        expect(res.every(r => expectedRelationalSchemes.some(r2 => r.equals(r2)))).toBeTruthy();
    });
});