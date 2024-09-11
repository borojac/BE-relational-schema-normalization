# Functional Dependencies and Relational Schemas Library

This library provides tools for working with **functional dependencies** and **relational schemas** in database theory. It supports common operations such as determining closures, decomposing functional dependencies, and checking for normalization forms like **3NF** and **BCNF**.

## Installation
```bash
npm  install  relational-schema-normalization
```
## Usage

### Functional  Dependency  Class

The  FunctionalDependency  class  represents  a  functional  dependency  in  a  relational  database.

#### Example:
```typescript
import { FunctionalDependency } from 'relational-schema-normalization';

const determinant = new Set(['A']);
const dependent = new Set(['B', 'C']);

const fd = new FunctionalDependency(determinant, dependent);

console.log(fd.determinant); // Set { 'A' }
console.log(fd.dependent);   // Set { 'B', 'C' }
```

#### Methods

-   **`equals(fd: FunctionalDependency): boolean`**: Compares two functional dependencies for equality.
-   **`decompose(): FunctionalDependency[]`**: Decomposes a functional dependency with multiple dependents into multiple functional dependencies, each with one dependent.

### Functional Dependency Set Class

The `FunctionalDependencySet` class is a collection of `FunctionalDependency` objects with operations for union, comparison, and manipulation.

#### Example

```typescript
import { FunctionalDependency, FunctionalDependencySet } from 'relational-schema-normalization';

const fd1 = new FunctionalDependency(new Set(['A']), new Set(['B']));
const fd2 = new FunctionalDependency(new Set(['B']), new Set(['C']));
const fdSet = new FunctionalDependencySet([fd1, fd2]);

console.log(fdSet.size());  // 2
console.log(fdSet.contains(fd1));  // true` 
```

#### Methods

-   **`add(fd: FunctionalDependency): boolean`**: Adds a functional dependency to the set.
-   **`union(otherFds: FunctionalDependencySet): FunctionalDependencySet`**: Returns the union of two functional dependency sets.
-   **`remove(fd: FunctionalDependency): FunctionalDependencySet`**: Removes a functional dependency from the set.
-   **`isSubsetOf(otherFds: FunctionalDependencySet): boolean`**: Checks if the set is a subset of another functional dependency set.

### Relational Schema Class

The `RelationalSchema` class represents a relational schema, which is a set of attributes.

#### Example

```typescript
import { RelationalSchema } from 'relational-schema-normalization';

const relationalSchema = new RelationalSchema(['A', 'B', 'C']);
console.log(relationalSchema.attributes);  // Set { 'A', 'B', 'C' }` 
```

#### Methods

-   **`equals(rs: RelationalSchema): boolean`**: Compares two relational schemas for equality.

### Utils Class

The `Utils` class provides various utility methods for computing closures, decomposing relations, and testing normalization forms.

#### Public Methods

1.  **`closureOfSetOfFunctionalDependenciesUsingAttributesClosure(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): FunctionalDependencySet`**
    
    -   **Description**: Computes the closure of a set of functional dependencies using attributes closure for a given relational schema and functional dependencies.
2.  **`closureOfSetOfFunctionalDependencies(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): FunctionalDependencySet`**
    
    -   **Description**: Computes the closure of a set of functional dependencies for a given relational schema and set of functional dependencies (slower method).
3.  **`closureOfSetOfAttributes(alpha: Set<string>, fds: FunctionalDependencySet): Set<string>`**
    
    -   **Description**: Computes the closure of a set of attributes for a given set of functional dependencies.
4.  **`computeMinimalCover(fdsParam: FunctionalDependencySet): FunctionalDependencySet`**
    
    -   **Description**: Computes the minimal cover of a set of functional dependencies.
5.  **`computeCandidateKeys(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): Set<string>[]`**
    
    -   **Description**: Computes the candidate keys for a given relational schema and set of functional dependencies.
6.  **`syntesisAlgorithmFor3NF(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): RelationalSchema[]`**
    
    -   **Description**: Decomposes a relational schema into into **3NF** (Third Normal Form).
7.  **`bcnfDecomposition(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): RelationalSchema[]`**
    
    -   **Description**: Decomposes a relational schema into **BCNF** (Boyce-Codd Normal Form).
8.  **`removeRedundantRelationalSchemas(relationalSchemasParam: RelationalSchema[]): RelationalSchema[]`**
    
    -   **Description**: Removes redundant relational schemas from the decomposition result.
9.  **`extractFunctionalDependenciesForSchema(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): FunctionalDependencySet`**
    
    -   **Description**: Extracts the functional dependencies for a given relational schema.
10.  **`isSchemaIn3NF(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): boolean`**
    

     -   **Description**: Checks whether a relational schema is in **3NF** (Third Normal Form).

11.  **`isSchemaInBNCF(relationalSchemaParam: RelationalSchema, fdsParam: FunctionalDependencySet): boolean`**

     -   **Description**: Checks whether a relational schema is in **BCNF** (Boyce-Codd Normal Form).

12.  **`removeExtraneousAttributes(fdParam: FunctionalDependency, fdsParam: FunctionalDependencySet): FunctionalDependencySet`**

     -   **Description**: Removes extraneous attributes from a functional dependency.

13.  **`decomposeFunctionalDependencies(fds: FunctionalDependencySet): FunctionalDependencySet`**

     -   **Description**: Decomposes each functional dependency that has multiple attributes on the right-hand side into single-attribute dependencies.

14.  **`areSetOfAttributesEqual(s1: Set<string>, s2: Set<string>): boolean`**

     -   **Description**: Compares two sets of attributes for equality.

15.  **`areSetsOfAttributesEqual(s1: Set<string>[], s2: Set<string>[]): boolean`**

     -   **Description**: Compares two array of sets of attributes for equality.

----------

### Example: BCNF Decomposition

```typescript
import { Utils, RelationalSchema, FunctionalDependencySet } from 'relational-schema-normalization';

const relationalSchema = new RelationalSchema(['A', 'B', 'C', 'D']);
const fds = new FunctionalDependencySet([
  new FunctionalDependency(new Set(['A']), new Set(['B'])),
  new FunctionalDependency(new Set(['B']), new Set(['C'])),
]);

const bcnf = Utils.bcnfDecomposition(relationalSchema, fds);
console.log(bcnf);  // Array of RelationalSchema objects after BCNF decomposition` 
```
----------
## License

MIT