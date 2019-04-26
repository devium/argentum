import {AbstractModel} from './abstract-model';

export namespace Status {
  export interface Dto {
    id: number;
    internalName: string;
    displayName: string;
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
}
