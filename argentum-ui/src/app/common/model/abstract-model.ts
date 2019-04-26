export abstract class AbstractModel {
  protected constructor(public id: number) {}

  equals(other: AbstractModel): boolean {
    // Compare by reference.
    if (this === other) {
      return true;
    }
    // Compare class.
    if (typeof(this) !== typeof(other)) {
      return false;
    }
    // Compare fields.
    for (const key of Object.keys(this)) {
      const value1 = this[key];
      const value2 = other[key];

      // Compare value type.
      if (typeof(value1) !== typeof(value2)) {
        return false;
      }

      if (value1 instanceof AbstractModel) {
        // Compare model references by ID.
        if (value1.id !== value2.id) {
          return false;
        }
      } else if (value1 instanceof Array) {
        if (value1.length !== value2.length) {
          return false;
        }
        for (let i = 0; i < value1.length; ++i) {
          if (value1[i] instanceof AbstractModel) {
            // Compare model arrays by ID.
            if (value1[i].id !== value2[i].id) {
              return false;
            }
            // Compare other arrays.
          } else if (value1[i] !== value2[i]) {
            return false;
          }
          // Note: mixed arrays seem ok but are not part of the spec.
        }
      } else if (value1 instanceof Date) {
        // Dates need special treatment.
        if (!value2 || value1.getTime() !== value2.getTime()) {
          return false;
        }
      } else if (value1 !== value2) {
        // Compare other types.
        return false;
      }
    }
    return true;
  }

  clone(): AbstractModel {
    const clone = Object.assign({}, this);
    for (const key of Object.keys(clone)) {
      // Copy arrays by value or the clones will share the same array reference.
      if (clone[key] instanceof Array) {
        clone[key] = [...clone[key]];
      }
    }
    return clone;
  }
}
