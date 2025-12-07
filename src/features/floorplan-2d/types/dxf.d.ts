/**
 * Type declarations for the dxf npm package
 */
declare module 'dxf' {
  export class Helper {
    constructor(contents: string);
    parse(): any;
    get parsed(): any;
    denormalise(): any;
    get denormalised(): any;
    group(): any;
    get groups(): any;
    toSVG(): string;
    toPolylines(): any;
  }

  export const parseString: (contents: string) => any;
  export const denormalise: (parsed: any) => any;
  export const toSVG: (parsed: any) => string;
  export const toPolylines: (parsed: any) => any;
  export const groupEntitiesByLayer: (denormalised: any) => any;
}

