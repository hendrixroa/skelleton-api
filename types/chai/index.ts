// tslint:disable-next-line
declare module Chai {
  export interface TypeComparison {
    uuid: () => void;
  }
  export interface Assertion {
    uuid: () => void;
  }
  export interface AssertionStatic {
    uuid: () => void;
  }
  export interface AssertStatic {
    uuid: (val: any) => void;
  }
}
