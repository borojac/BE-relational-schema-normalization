import { FunctionalDependency } from "./FunctionalDependency";
import { FunctionalDependencySet } from "./FunctionalDependencySet";
import { RelationalScheme } from "./RelationalScheme";

export class Utils {
    public static closureOfSetOfFunctionalDependenciesUsingAttributesClosure(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet) {
        const attributeSubsets: Set<string>[] = Utils.generateSubsets(relationalSchemeParam.attributes);

        const fds: FunctionalDependencySet = new FunctionalDependencySet();
        for (let attributeSubset of attributeSubsets) {
            const alphaPlus = Utils.closureOfSetOfAttributes(attributeSubset, fdsParam);
            for (let alphaPlusSubset of Utils.generateSubsets(alphaPlus)) {
                fds.add(new FunctionalDependency(attributeSubset, alphaPlusSubset));
            }
        }
        return fds;
    }

    public static closureOfSetOfFunctionalDependencies(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet) {
        const fPlus = new FunctionalDependencySet(fdsParam);

        // Reflexivity
        const relationalSchemeSubsets: Set<string>[] = Utils.generateSubsets(
            relationalSchemeParam.attributes
        );
        for (const relationalSchemeSubset of relationalSchemeSubsets) {
            const alphaSubsets: Set<string>[] = Utils.generateSubsets(relationalSchemeSubset);
            for (const alphaSubset of alphaSubsets) {
                fPlus.add(new FunctionalDependency(relationalSchemeSubset, alphaSubset));
            }
        }

        let fPlusPrev: FunctionalDependencySet;
        do {
            fPlusPrev = new FunctionalDependencySet(fPlus);

            // Augmentation
            const fdsLen = fPlus.size();
            for (let i = 0; i < fdsLen; i++) {
                const fd = fPlus.fdArray[i];
                relationalSchemeSubsets.forEach(
                    augmentationSubset => fPlus.add(
                        new FunctionalDependency(Utils.union(fd.determinant, augmentationSubset),
                            Utils.union(fd.dependent, augmentationSubset))
                    )
                );
            }

            // Transitivity
            for (let i = 0; i < fPlus.fdArray.length - 1; i++) {
                for (let j = i + 1; j < fPlus.fdArray.length; j++) {
                    if (i != j) {
                        const fd1 = fPlus.fdArray[i];
                        const fd2 = fPlus.fdArray[j];
                        if (Utils.areSetOfAttributesEqual(fd1.dependent, fd2.determinant)) {
                            fPlus.add(new FunctionalDependency(fd1.determinant, fd2.dependent));
                        }
                        if (Utils.areSetOfAttributesEqual(fd2.dependent, fd1.determinant)) {
                            fPlus.add(new FunctionalDependency(fd2.determinant, fd1.dependent));
                        }
                    }
                }
            }
        } while (!fPlus.equals(fPlusPrev))

        return fPlus;
    }

    public static closureOfSetOfAttributes(alpha: Set<string>, fds: FunctionalDependencySet): Set<string> {
        let alphaPlus: Set<string> = new Set<string>(alpha);
        let aplhaPlusPrev: Set<string>;
        do {
            aplhaPlusPrev = new Set<string>(alphaPlus);
            for (let fd of fds.fdArray) {
                if (Utils.isSubsetOf(fd.determinant, alphaPlus)) {
                    alphaPlus = Utils.union(alphaPlus, fd.dependent);
                }
            }
        } while (!Utils.areSetOfAttributesEqual(aplhaPlusPrev, alphaPlus))
        return alphaPlus;
    }

    public static computeMinimalCover(fdsParam: FunctionalDependencySet): FunctionalDependencySet {
        let fm: FunctionalDependencySet = new FunctionalDependencySet(fdsParam);

        fm = Utils.decomposeFunctionalDependencies(fm);

        for (let fd of new FunctionalDependencySet(fdsParam).fdArray) {
            if (fd.dependent.size === 1 && fd.determinant.size > 1) {
                fm = Utils.removeExtraneousAttributes(fd, fm);
            }
        }

        for (let fd of fm.fdArray) {
            if (fd.dependent.size === 1) {
                const dependent: string = fd.dependent.values().next().value;
                const alphaPlus: Set<string> = Utils.closureOfSetOfAttributes(fd.determinant, fm.remove(fd));
                if (alphaPlus.has(dependent)) {
                    fm = fm.remove(fd);
                }
            }
        }

        return fm;
    }

    public static computeCandidateKeys(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet): Set<string>[] {
        const potentialKeys: Set<string>[] = Utils.generateSubsets(new Set(relationalSchemeParam.attributes));
        const candidateKeys: Set<string>[] = [];
        let candidateKeyCardinality: number = relationalSchemeParam.attributes.size;
        for (let potentialKey of potentialKeys) {
            if (potentialKey.size > candidateKeyCardinality) {
                break;
            }
            const attrs: Set<string> = this.closureOfSetOfAttributes(potentialKey, fdsParam);
            if (Utils.isSubsetOf(relationalSchemeParam.attributes, attrs)) {
                candidateKeys.push(potentialKey);
                candidateKeyCardinality = potentialKey.size;
            }
        }

        return candidateKeys;
    }

    public static syntesisAlgorithmFor3NF(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet): RelationalScheme[] {
        if (this.isSchemeIn3NF(relationalSchemeParam, fdsParam)) {
            return [new RelationalScheme([...relationalSchemeParam.attributes])];
        }

        const fm = Utils.computeMinimalCover(fdsParam);
        const relationalSchemesResult: RelationalScheme[] = [];

        const determinants: Set<string>[] = Utils.extractDifferentDeterminants(fm);
        for (let determinant of determinants) {
            let tempRelationalSchemeAttrs = [...determinant];
            for (let fd of fm.fdArray) {
                if (Utils.areSetOfAttributesEqual(determinant, fd.determinant)) {
                    tempRelationalSchemeAttrs = [...tempRelationalSchemeAttrs, ...fd.dependent];
                }
            }
            relationalSchemesResult.push(new RelationalScheme(tempRelationalSchemeAttrs));
        }

        const candidateKeys = Utils.computeCandidateKeys(relationalSchemeParam, fm);
        let candidateKeysIncluded: boolean = false;
        for (let candidateKey of candidateKeys) {
            for (let relationalScheme of relationalSchemesResult) {
                if (Utils.isSubsetOf(candidateKey, relationalScheme.attributes)) {
                    candidateKeysIncluded = true;
                }
            }
        }

        if (!candidateKeysIncluded) {
            relationalSchemesResult.push(new RelationalScheme([...candidateKeys[0]]))
        }

        return Utils.removeRedundantRelationalSchemas(relationalSchemesResult);
    }

    public static removeRedundantRelationalSchemas(relationalSchemesParam: RelationalScheme[]): RelationalScheme[] {
        const relationalSchemes: RelationalScheme[] = [];
        relationalSchemesParam.forEach(rs => relationalSchemes.push(new RelationalScheme([...rs.attributes])))
        relationalSchemes.sort((a, b) => a.attributes.size - b.attributes.size)

        const res = [];
        for (let i = 0; i < relationalSchemes.length; i ++) {
            let append = true;
            for (let j = i + 1; j < relationalSchemes.length; j ++) {
                if (Utils.isSubsetOf(relationalSchemes[i].attributes, relationalSchemes[j].attributes)) {
                    append = false;
                    break;
                }
            }
            if (append) {
                res.push(relationalSchemes[i]);
            }
        }

        return res;
    }

    public static bcnfDecomposition(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet): RelationalScheme[] {
        if (this.isSchemeInBNCF(relationalSchemeParam, fdsParam)) {
            return [new RelationalScheme([...relationalSchemeParam.attributes])];
        }
        
        const D = new Array<RelationalScheme>(relationalSchemeParam);

        const fdsClosure: FunctionalDependencySet = new FunctionalDependencySet(Utils.closureOfSetOfFunctionalDependenciesUsingAttributesClosure(relationalSchemeParam, fdsParam));

        for (let i = 0; i < D.length; i ++) {
            const fds = Utils.extractFunctionalDependenciesForScheme(D[i], fdsClosure);
            for (let fd of fds.fdArray) {
                if (!Utils.isFunctionalDependencyBNCF(D[i], fd, fds)) {
                    D.splice(i, 1, new RelationalScheme([...fd.determinant, ...fd.dependent]), new RelationalScheme([...fd.determinant, ...Utils.differenceA_B(D[i].attributes, fd.dependent)]));
                    i --;
                    break;
                }
            }
        }

        return Utils.removeRedundantRelationalSchemas(D);
    }

    public static extractFunctionalDependenciesForScheme(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet) {
        return new FunctionalDependencySet(fdsParam.fdArray.filter(fd => Utils.isSubsetOf(fd.determinant, relationalSchemeParam.attributes) && Utils.isSubsetOf(fd.dependent, relationalSchemeParam.attributes)));
    }

    public static isSchemeIn3NF(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet) {
        const candidateKeys = Utils.computeCandidateKeys(relationalSchemeParam, fdsParam);
        return fdsParam.fdArray.every(fd => Utils.isFunctionalDependency3NF(relationalSchemeParam, fd, fdsParam, candidateKeys));
    }

    public static isSchemeInBNCF(relationalSchemeParam: RelationalScheme, fdsParam: FunctionalDependencySet) {
        return fdsParam.fdArray.every(fd => Utils.isFunctionalDependencyBNCF(relationalSchemeParam, fd, fdsParam));
    }

    public static isFunctionalDependency3NF(relationalSchemeParam: RelationalScheme, fdParam: FunctionalDependency, fdsParam: FunctionalDependencySet, candidateKeys: Set<string>[]) {
        return this.isFunctionalDependencyBNCF(relationalSchemeParam, fdParam, fdsParam) ||
                [...Utils.differenceA_B(fdParam.dependent, fdParam.determinant)].every(attr => [...candidateKeys].some(candidateKey => candidateKey.has(attr)));
    }

    public static isFunctionalDependencyBNCF(relationalSchemeParam: RelationalScheme, fdParam: FunctionalDependency, fdsParam: FunctionalDependencySet): boolean {
        return Utils.isSubsetOf(fdParam.dependent, fdParam.determinant) || Utils.isSubsetOf(relationalSchemeParam.attributes, this.closureOfSetOfAttributes(fdParam.determinant, fdsParam));
    }

    public static removeExtraneousAttributes(fdParam: FunctionalDependency, fdsParam: FunctionalDependencySet): FunctionalDependencySet {
        let fd = new FunctionalDependency(fdParam.determinant, fdParam.dependent);
        let fds: FunctionalDependencySet = new FunctionalDependencySet(fdsParam);
        for (let attribute of new Set<string>(fdParam.determinant)) {
            if (fd.determinant.size > 1) {
                let newFd = new FunctionalDependency(new Set([...fd.determinant].filter(attr => attr != attribute)), fd.dependent);

                const alphaPlus = Utils.closureOfSetOfAttributes(newFd.determinant, fdsParam);
                if (Utils.isSubsetOf(fd.dependent, alphaPlus, false)) {
                    fds = fds.replace(fd, newFd);
                    fd = new FunctionalDependency(newFd.determinant, newFd.dependent);
                }
            }
        }
        return fds;
    }

    public static decomposeFunctionalDependencies(fds: FunctionalDependencySet): FunctionalDependencySet {
        let newFds: FunctionalDependencySet = new FunctionalDependencySet();
        for (let fd of fds.fdArray) {
            const decomposedFdArray: FunctionalDependency[] = fd.decompose();
            for (let decomposedFd of decomposedFdArray) {
                newFds.add(decomposedFd);
            }
        }

        return newFds;
    }

    public static areSetOfAttributesEqual(s1: Set<string>, s2: Set<string>) {
        return s1.size === s2.size && [...s1].every((el) => s2.has(el));
    }

    public static areSetsOfAttributesEqual(s1: Set<string>[], s2: Set<string>[]) {
        return s1.length === s2.length && s1.every(setOfAttrs1 => s2.some(setOfAttrs2 => Utils.areSetOfAttributesEqual(setOfAttrs1, setOfAttrs2)));
    }

    public static isSubsetOf(a: Set<string>, b: Set<string>, isStrictSubset: boolean = false) {
        const isSubset = [...a].every(el => b.has(el));

        if (!isSubset || (isStrictSubset && a.size === b.size)) return false;

        return true;
    }

    public static union(a: Set<string>, b: Set<string>) {
        return new Set([...a, ...b]);
    }

    public static differenceA_B(a: Set<string>, b: Set<string>) {
        return new Set([...a].filter(el => !b.has(el)));
    }

    public static generateSubsets(set: Set<string>): Set<string>[] {
        const subsets: Set<string>[] = [];

        for (const element of set) {
            const currentLength = subsets.length;
            subsets.push(new Set([element]));
            for (let i = 0; i < currentLength; i++) {
                const newSubset = new Set(subsets[i]);
                newSubset.add(element);
                subsets.push(newSubset);
            }
        }

        subsets.sort((a, b) => a.size - b.size);
        return subsets;
    }

    public static extractRelationalSchemaAttributes(fds: FunctionalDependencySet): Set<string> {
        let res: Set<string> = new Set<string>();
        for (let fd of fds.fdArray) {
            res = new Set([...res, ...fd.determinant, ...fd.dependent]);
        }
        return res;
    }

    public static extractDifferentDeterminants(fdsParam: FunctionalDependencySet): Set<string>[] {
        const result: Set<string>[] = [];
        for (let fd of fdsParam.fdArray) {
            if (result.every(s => !Utils.areSetOfAttributesEqual(s, fd.determinant))) {
                result.push(new Set<string>(fd.determinant));
            }
        }
        return result;
    }
}