import { FunctionalDependency } from "./FunctionalDependency";

export class FunctionalDependencySet {
    private _fdArray: FunctionalDependency[];

    constructor(fdParam: FunctionalDependency[] | FunctionalDependencySet = []) {
        const fdArray: FunctionalDependency[] = (fdParam instanceof FunctionalDependencySet) ? fdParam.fdArray : fdParam;
        this._fdArray = [];
        for (let fd of fdArray) {
            this.add(new FunctionalDependency(fd.determinant, fd.dependent));
        }
    }

    get fdArray() {
        return this._fdArray;
    }

    add(fdParam: FunctionalDependency): boolean {
        for (let fd of this._fdArray) {
            if (fd.equals(fdParam)) return false;
        }
        this._fdArray.push(fdParam);
        return true;
    }

    union(otherFds: FunctionalDependencySet): FunctionalDependencySet {
        let newFds = new FunctionalDependencySet([]);
        for (let fds of this._fdArray)
            newFds.add(fds);
        for (let fds of otherFds._fdArray) {
            newFds.add(fds);
        }

        return newFds;
    }

    contains(fd: FunctionalDependency): boolean {
        return this._fdArray.some((_fd) => _fd.equals(fd));
    }


    equals(otherFds: FunctionalDependencySet): boolean {
        return this._fdArray.length === otherFds._fdArray.length && this._fdArray.every((fd) => otherFds.contains(fd));
    }

    isSubsetOf(otherFds: FunctionalDependencySet, isStrictSubset: boolean = false): boolean {
        const isSubset: boolean = this._fdArray.every((fd) => otherFds.contains(fd));
        if (!isSubset) {
            return false;
        }

        if (isStrictSubset && otherFds._fdArray.length === this._fdArray.length) return false;

        return true;
    }

    remove(fdParam: FunctionalDependency): FunctionalDependencySet {
        return new FunctionalDependencySet(this._fdArray.filter((fd) => !fd.equals(fdParam)));
    }

    replace(fdParam: FunctionalDependency, fdReplacement: FunctionalDependency) {
        if (!this.contains(fdParam)) {
            return new FunctionalDependencySet(this);
        }
        return new FunctionalDependencySet([...this._fdArray.filter(fd => !fd.equals(fdParam)), fdReplacement]);
    }

    size() {
        return this._fdArray.length;
    }

}