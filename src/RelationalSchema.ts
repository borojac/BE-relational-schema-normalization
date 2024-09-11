import { Utils } from "./Utils";

export class RelationalSchema {
    private _attributes: Set<string>;

    constructor(attributes: string[] = []) {
        if (!Array.isArray(attributes)) {
            throw new Error('Relational schema attributes must be array of strings');
        }
        this._attributes = new Set<string>(attributes);
    }

    get attributes() {
        return this._attributes;
    }

    equals(rs: RelationalSchema) {
        return Utils.areSetOfAttributesEqual(this.attributes, rs.attributes); 
    }
}