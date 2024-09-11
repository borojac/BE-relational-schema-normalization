import { FunctionalDependency } from "../src/FunctionalDependency";
import { FunctionalDependencySet } from "../src/FunctionalDependencySet";
import { RelationalSchema } from "../src/RelationalSchema";
import { Utils } from "../src/Utils";

describe('Compute minimal cover', () => {
    it('should compute correct minimal cover (1)', () => {
        const relationalSchema = new RelationalSchema(['A', 'B', 'C', 'D']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A', 'B']), new Set(['C'])),
            new FunctionalDependency(new Set(['B']), new Set(['A', 'D'])),
            new FunctionalDependency(new Set(['C']), new Set(['B'])),
            new FunctionalDependency(new Set(['B','C','D']), new Set(['A'])),
        ])
        
        const minimalCoverFds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['B']), new Set(['A'])),
            new FunctionalDependency(new Set(['B']), new Set(['C'])),
            new FunctionalDependency(new Set(['B']), new Set(['D'])),
            new FunctionalDependency(new Set(['C']), new Set(['B'])),
        ])

        const res = Utils.computeMinimalCover(fds);

        expect(res.fdArray.length).toEqual(minimalCoverFds.fdArray.length);
        expect(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, res).equals(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, minimalCoverFds))).toBeTruthy();
    });

    it('should compute correct minimal cover (2)', () => {
        const relationalSchema = new RelationalSchema(['A', 'B', 'C', 'D', 'E']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A']), new Set(['B'])),
            new FunctionalDependency(new Set(['A', 'B']), new Set(['C'])),
            new FunctionalDependency(new Set(['D']), new Set(['A', 'C'])),
            new FunctionalDependency(new Set(['D']), new Set(['E'])),
        ])
        
        const minimalCoverFds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A']), new Set(['B'])),
            new FunctionalDependency(new Set(['A']), new Set(['C'])),
            new FunctionalDependency(new Set(['D']), new Set(['A'])),
            new FunctionalDependency(new Set(['D']), new Set(['E'])),
        ])

        const res = Utils.computeMinimalCover(fds);

        expect(res.fdArray.length).toEqual(minimalCoverFds.fdArray.length);
        expect(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, res).equals(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, minimalCoverFds))).toBeTruthy();
    });

    it('should compute correct minimal cover (3)', () => {
        const relationalSchema = new RelationalSchema(['A', 'B', 'C', 'D']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['B']), new Set(['A'])),
            new FunctionalDependency(new Set(['D']), new Set(['A'])),
            new FunctionalDependency(new Set(['A', 'B']), new Set(['D'])),
        ])
        
        const minimalCoverFds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['B']), new Set(['D'])),
            new FunctionalDependency(new Set(['D']), new Set(['A'])),
        ])

        const res = Utils.computeMinimalCover(fds);

        expect(res.fdArray.length).toEqual(minimalCoverFds.fdArray.length);
        expect(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, res).equals(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, minimalCoverFds))).toBeTruthy();
    });

    it('should compute correct minimal cover (4)', () => {
        const relationalSchema = new RelationalSchema(['a', 'b', 'c', 'd', 'e']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a']), new Set(['b'])),
            new FunctionalDependency(new Set(['a', 'c']), new Set(['d'])),
            new FunctionalDependency(new Set(['a', 'c']), new Set(['e'])),
            new FunctionalDependency(new Set(['a','d']), new Set(['e'])),
            new FunctionalDependency(new Set(['a','d']), new Set(['c'])),
            new FunctionalDependency(new Set(['c','d']), new Set(['a'])),
            new FunctionalDependency(new Set(['c','d']), new Set(['b'])),
            new FunctionalDependency(new Set(['c','d']), new Set(['e'])),
        ])
        
        const minimalCoverFds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['a']), new Set(['b'])),
            new FunctionalDependency(new Set(['c', 'd']), new Set(['e'])),
            new FunctionalDependency(new Set(['c', 'd']), new Set(['a'])),
            new FunctionalDependency(new Set(['a', 'd']), new Set(['c'])),
            new FunctionalDependency(new Set(['a', 'c']), new Set(['d'])),
        ])

        const res = Utils.computeMinimalCover(fds);

        expect(res.fdArray.length).toEqual(minimalCoverFds.fdArray.length);
        expect(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, res).equals(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, minimalCoverFds))).toBeTruthy();
    });

    it('should compute correct minimal cover (5)', () => {
        const relationalSchema = new RelationalSchema(['A0', 'A1', 'A2', 'A3', 'A4']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A0', 'A4']), new Set(['A2', 'A3'])),
            new FunctionalDependency(new Set(['A0', 'A2', 'A3']), new Set(['A1', 'A4'])),
            new FunctionalDependency(new Set(['A1']), new Set(['A5'])),
            new FunctionalDependency(new Set(['A5']), new Set(['A1'])),
        ])
        
        const minimalCoverFds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['A0', 'A4']), new Set(['A2'])),
            new FunctionalDependency(new Set(['A0', 'A4']), new Set(['A3'])),
            new FunctionalDependency(new Set(['A0', 'A2', 'A3']), new Set(['A1'])),
            new FunctionalDependency(new Set(['A0', 'A2', 'A3']), new Set(['A4'])),
            new FunctionalDependency(new Set(['A1']), new Set(['A5'])),
            new FunctionalDependency(new Set(['A5']), new Set(['A1'])),
        ])

        const res = Utils.computeMinimalCover(fds);

        expect(res.fdArray.length).toEqual(minimalCoverFds.fdArray.length);
        expect(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, res).equals(Utils.closureOfSetOfFunctionalDependencies(relationalSchema, minimalCoverFds))).toBeTruthy();
    });
});