import { FunctionalDependency } from "../src/FunctionalDependency"
import { FunctionalDependencySet } from "../src/FunctionalDependencySet"
import { RelationalScheme } from "../src/RelationalScheme";
import { Utils } from "../src/Utils"

describe('Closure of set of functional dependencies', () => {
    it('should calculate correct set of functional dependencies (1)', () => {
        const relationalScheme = new RelationalScheme(['JMB', 'ImeStudenta', 'BrojIndeksa', 'StudijskiProgram', 'GodinaStudija']);
        const fds = new FunctionalDependencySet([
            new FunctionalDependency(new Set(['JMB']), new Set(['ImeStudenta'])),
            new FunctionalDependency(new Set(['JMB', 'BrojIndeksa']), new Set(['StudijskiProgram'])),
            new FunctionalDependency(new Set(['JMB', 'BrojIndeksa']), new Set(['GodinaStudija'])),
            new FunctionalDependency(new Set(['JMB','StudijskiProgram']), new Set(['BrojIndeksa'])),
            new FunctionalDependency(new Set(['JMB','StudijskiProgram']), new Set(['GodinaStudija'])),
            new FunctionalDependency(new Set(['BrojIndeksa','StudijskiProgram']), new Set(['JMB'])),
            new FunctionalDependency(new Set(['BrojIndeksa','StudijskiProgram']), new Set(['ImeStudenta'])),
            new FunctionalDependency(new Set(['BrojIndeksa','StudijskiProgram']), new Set(['GodinaStudija'])),
        ])

        expect(Utils.closureOfSetOfFunctionalDependencies(relationalScheme, fds).equals(Utils.closureOfSetOfFunctionalDependenciesUsingAttributesClosure(relationalScheme, fds))).toBeTruthy();
    });

    it('should calculate correct set of functional dependencies (2)', () => {
        const relationalScheme = new RelationalScheme(['a', 'b', 'c', 'd', 'e']);
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
        
        expect(Utils.closureOfSetOfFunctionalDependencies(relationalScheme, fds).equals(Utils.closureOfSetOfFunctionalDependenciesUsingAttributesClosure(relationalScheme, fds))).toBeTruthy();
    });

    it('should calculate correct set of functional dependencies (3)', () => {
        const relationalScheme = new RelationalScheme(['a', 'b', 'c', 'd', 'e']);
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

        expect(Utils.closureOfSetOfFunctionalDependencies(relationalScheme, fds).equals(Utils.closureOfSetOfFunctionalDependenciesUsingAttributesClosure(relationalScheme, fds))).toBeTruthy();
    });
})