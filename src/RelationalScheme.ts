import { Utils } from "./Utils";

export class RelationalScheme {
    private _attributes: Set<string>;

    constructor(attributes: string[] = []) {
        if (!Array.isArray(attributes)) {
            throw new Error('Relational scheme attributes must be array of strings');
        }
        this._attributes = new Set<string>(attributes);
    }

    get attributes() {
        return this._attributes;
    }

    equals(rs: RelationalScheme) {
        return Utils.areSetOfAttributesEqual(this.attributes, rs.attributes); 
    }
}