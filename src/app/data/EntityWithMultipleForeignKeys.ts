import {DatabaseEntity} from "./DatabaseEntity";

export abstract class EntityWithMultipleForeignKeys implements DatabaseEntity{
  public id:string = undefined;
}
