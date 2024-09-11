import { FunctionalDependency } from "../src/FunctionalDependency";
import { FunctionalDependencySet } from "../src/FunctionalDependencySet";
import { RelationalSchema } from "../src/RelationalSchema"
import { Utils } from "../src/Utils";

describe('Compute candidate keys', () => {
    it('should compute correct candidate keys (1)', () => {
        const relationalSchema: RelationalSchema = new RelationalSchema(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a', 'b']), new Set('e')),
            new FunctionalDependency(new Set(['b']), new Set('c')),
            new FunctionalDependency(new Set(['c']), new Set('d')),
            new FunctionalDependency(new Set(['d']), new Set('b')),
        ]);
        const expectedCandidateKeys: Set<string>[] = [
            new Set(['a', 'b']),
            new Set(['a', 'c']),
            new Set(['a', 'd']),
        ];

        const res = Utils.computeCandidateKeys(relationalSchema, fds);

        expect(Utils.areSetsOfAttributesEqual(res, expectedCandidateKeys)).toBeTruthy();
    })

    it('should compute correct candidate keys (2)', () => {
        const relationalSchema: RelationalSchema = new RelationalSchema(['a', 'b', 'c', 'd']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a', 'c']), new Set('d')),
            new FunctionalDependency(new Set(['d']), new Set('a')),
        ]);
        const expectedCandidateKeys: Set<string>[] = [
            new Set(['a', 'b', 'c']),
            new Set(['b', 'c', 'd']),
        ];

        const res = Utils.computeCandidateKeys(relationalSchema, fds);

        expect(Utils.areSetsOfAttributesEqual(res, expectedCandidateKeys)).toBeTruthy();
    })

    it('should compute correct candidate keys (3)', () => {
        const relationalSchema: RelationalSchema = new RelationalSchema(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a']), new Set('b')),
            new FunctionalDependency(new Set(['a', 'b']), new Set('c')),
            new FunctionalDependency(new Set(['d']), new Set(['a', 'c'])),
            new FunctionalDependency(new Set(['d']), new Set('e')),
        ]);
        const expectedCandidateKeys: Set<string>[] = [
            new Set(['d']),
        ];

        const res = Utils.computeCandidateKeys(relationalSchema, fds);

        expect(Utils.areSetsOfAttributesEqual(res, expectedCandidateKeys)).toBeTruthy();
    })

    it('should compute correct candidate keys (4)', () => {
        const relationalSchema: RelationalSchema = new RelationalSchema(['a', 'b', 'c', 'd', 'e', 'f']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a', 'c']), new Set('b')),
            new FunctionalDependency(new Set(['c']), new Set(['d', 'e'])),
            new FunctionalDependency(new Set(['b']), new Set(['a'])),
            new FunctionalDependency(new Set(['a']), new Set('c')),
            new FunctionalDependency(new Set(['a']), new Set('e')),
        ]);
        const expectedCandidateKeys: Set<string>[] = [
            new Set(['a', 'f']),
            new Set(['b', 'f']),
        ];

        const res = Utils.computeCandidateKeys(relationalSchema, fds);

        expect(Utils.areSetsOfAttributesEqual(res, expectedCandidateKeys)).toBeTruthy();
    })
})