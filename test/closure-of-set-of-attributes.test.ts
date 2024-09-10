import { FunctionalDependencySet } from '../src/FunctionalDependencySet'
import { FunctionalDependency } from '../src/FunctionalDependency'
import { Utils } from '../src/Utils';

describe('Closure of set of attributes', () => {
    it('should return correct result', () => {
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['B']), new Set(['C', 'E'])),
            new FunctionalDependency(new Set(['C']), new Set(['D'])),
            new FunctionalDependency(new Set(['E']), new Set(['A'])),
        ])

        expect(Utils.closureOfSetOfAttributes(new Set(['A']), fds)).toEqual(new Set(['A']));
        expect(Utils.closureOfSetOfAttributes(new Set(['B']), fds)).toEqual(new Set(['A', 'B', 'C', 'D', 'E']));
        expect(Utils.closureOfSetOfAttributes(new Set(['C']), fds)).toEqual(new Set(['C', 'D']));
        expect(Utils.closureOfSetOfAttributes(new Set(['D']), fds)).toEqual(new Set(['D']));
        expect(Utils.closureOfSetOfAttributes(new Set(['E']), fds)).toEqual(new Set(['A', 'E']));
    })
})