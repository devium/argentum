import {AbstractModel} from './abstract-model';

export namespace Status {
  export interface Dto {
    id: number;
    internal_name: string;
    display_name: string;
    color: string;
  }
}

export class Status extends AbstractModel {
  constructor(
    id: number,
    public internalName: string,
    public displayName: string,
    public color: string
  ) {
    super(id);
  }

  static fromDto(dto: Status.Dto): Status {
    return new Status(
      dto.id,
      dto.internal_name,
      dto.display_name,
      dto.color
    );
  }

  toDto(): Status.Dto {
    return {
      id: undefined,
      internal_name: this.internalName,
      display_name: this.displayName,
      color: this.color
    };
  }
}
