
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserSession
 * 
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model SiteAnalysis
 * 
 */
export type SiteAnalysis = $Result.DefaultSelection<Prisma.$SiteAnalysisPayload>
/**
 * Model Floorplan
 * 
 */
export type Floorplan = $Result.DefaultSelection<Prisma.$FloorplanPayload>
/**
 * Model Model3D
 * 
 */
export type Model3D = $Result.DefaultSelection<Prisma.$Model3DPayload>
/**
 * Model Massing
 * 
 */
export type Massing = $Result.DefaultSelection<Prisma.$MassingPayload>
/**
 * Model File
 * 
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>
/**
 * Model GeospatialCache
 * 
 */
export type GeospatialCache = $Result.DefaultSelection<Prisma.$GeospatialCachePayload>
/**
 * Model SketchfabToken
 * 
 */
export type SketchfabToken = $Result.DefaultSelection<Prisma.$SketchfabTokenPayload>
/**
 * Model SketchfabModel
 * 
 */
export type SketchfabModel = $Result.DefaultSelection<Prisma.$SketchfabModelPayload>
/**
 * Model CadBlock
 * 
 */
export type CadBlock = $Result.DefaultSelection<Prisma.$CadBlockPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.siteAnalysis`: Exposes CRUD operations for the **SiteAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SiteAnalyses
    * const siteAnalyses = await prisma.siteAnalysis.findMany()
    * ```
    */
  get siteAnalysis(): Prisma.SiteAnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.floorplan`: Exposes CRUD operations for the **Floorplan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Floorplans
    * const floorplans = await prisma.floorplan.findMany()
    * ```
    */
  get floorplan(): Prisma.FloorplanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.model3D`: Exposes CRUD operations for the **Model3D** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Model3DS
    * const model3DS = await prisma.model3D.findMany()
    * ```
    */
  get model3D(): Prisma.Model3DDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.massing`: Exposes CRUD operations for the **Massing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Massings
    * const massings = await prisma.massing.findMany()
    * ```
    */
  get massing(): Prisma.MassingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.geospatialCache`: Exposes CRUD operations for the **GeospatialCache** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GeospatialCaches
    * const geospatialCaches = await prisma.geospatialCache.findMany()
    * ```
    */
  get geospatialCache(): Prisma.GeospatialCacheDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sketchfabToken`: Exposes CRUD operations for the **SketchfabToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SketchfabTokens
    * const sketchfabTokens = await prisma.sketchfabToken.findMany()
    * ```
    */
  get sketchfabToken(): Prisma.SketchfabTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sketchfabModel`: Exposes CRUD operations for the **SketchfabModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SketchfabModels
    * const sketchfabModels = await prisma.sketchfabModel.findMany()
    * ```
    */
  get sketchfabModel(): Prisma.SketchfabModelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cadBlock`: Exposes CRUD operations for the **CadBlock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CadBlocks
    * const cadBlocks = await prisma.cadBlock.findMany()
    * ```
    */
  get cadBlock(): Prisma.CadBlockDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserSession: 'UserSession',
    Project: 'Project',
    SiteAnalysis: 'SiteAnalysis',
    Floorplan: 'Floorplan',
    Model3D: 'Model3D',
    Massing: 'Massing',
    File: 'File',
    GeospatialCache: 'GeospatialCache',
    SketchfabToken: 'SketchfabToken',
    SketchfabModel: 'SketchfabModel',
    CadBlock: 'CadBlock'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "userSession" | "project" | "siteAnalysis" | "floorplan" | "model3D" | "massing" | "file" | "geospatialCache" | "sketchfabToken" | "sketchfabModel" | "cadBlock"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      SiteAnalysis: {
        payload: Prisma.$SiteAnalysisPayload<ExtArgs>
        fields: Prisma.SiteAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SiteAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SiteAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>
          }
          findFirst: {
            args: Prisma.SiteAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SiteAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>
          }
          findMany: {
            args: Prisma.SiteAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>[]
          }
          create: {
            args: Prisma.SiteAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>
          }
          createMany: {
            args: Prisma.SiteAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SiteAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>[]
          }
          delete: {
            args: Prisma.SiteAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>
          }
          update: {
            args: Prisma.SiteAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.SiteAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SiteAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SiteAnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>[]
          }
          upsert: {
            args: Prisma.SiteAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteAnalysisPayload>
          }
          aggregate: {
            args: Prisma.SiteAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSiteAnalysis>
          }
          groupBy: {
            args: Prisma.SiteAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<SiteAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.SiteAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<SiteAnalysisCountAggregateOutputType> | number
          }
        }
      }
      Floorplan: {
        payload: Prisma.$FloorplanPayload<ExtArgs>
        fields: Prisma.FloorplanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FloorplanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FloorplanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>
          }
          findFirst: {
            args: Prisma.FloorplanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FloorplanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>
          }
          findMany: {
            args: Prisma.FloorplanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>[]
          }
          create: {
            args: Prisma.FloorplanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>
          }
          createMany: {
            args: Prisma.FloorplanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FloorplanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>[]
          }
          delete: {
            args: Prisma.FloorplanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>
          }
          update: {
            args: Prisma.FloorplanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>
          }
          deleteMany: {
            args: Prisma.FloorplanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FloorplanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FloorplanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>[]
          }
          upsert: {
            args: Prisma.FloorplanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FloorplanPayload>
          }
          aggregate: {
            args: Prisma.FloorplanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFloorplan>
          }
          groupBy: {
            args: Prisma.FloorplanGroupByArgs<ExtArgs>
            result: $Utils.Optional<FloorplanGroupByOutputType>[]
          }
          count: {
            args: Prisma.FloorplanCountArgs<ExtArgs>
            result: $Utils.Optional<FloorplanCountAggregateOutputType> | number
          }
        }
      }
      Model3D: {
        payload: Prisma.$Model3DPayload<ExtArgs>
        fields: Prisma.Model3DFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Model3DFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Model3DFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>
          }
          findFirst: {
            args: Prisma.Model3DFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Model3DFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>
          }
          findMany: {
            args: Prisma.Model3DFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>[]
          }
          create: {
            args: Prisma.Model3DCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>
          }
          createMany: {
            args: Prisma.Model3DCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.Model3DCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>[]
          }
          delete: {
            args: Prisma.Model3DDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>
          }
          update: {
            args: Prisma.Model3DUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>
          }
          deleteMany: {
            args: Prisma.Model3DDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Model3DUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.Model3DUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>[]
          }
          upsert: {
            args: Prisma.Model3DUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Model3DPayload>
          }
          aggregate: {
            args: Prisma.Model3DAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModel3D>
          }
          groupBy: {
            args: Prisma.Model3DGroupByArgs<ExtArgs>
            result: $Utils.Optional<Model3DGroupByOutputType>[]
          }
          count: {
            args: Prisma.Model3DCountArgs<ExtArgs>
            result: $Utils.Optional<Model3DCountAggregateOutputType> | number
          }
        }
      }
      Massing: {
        payload: Prisma.$MassingPayload<ExtArgs>
        fields: Prisma.MassingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MassingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MassingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>
          }
          findFirst: {
            args: Prisma.MassingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MassingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>
          }
          findMany: {
            args: Prisma.MassingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>[]
          }
          create: {
            args: Prisma.MassingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>
          }
          createMany: {
            args: Prisma.MassingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MassingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>[]
          }
          delete: {
            args: Prisma.MassingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>
          }
          update: {
            args: Prisma.MassingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>
          }
          deleteMany: {
            args: Prisma.MassingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MassingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MassingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>[]
          }
          upsert: {
            args: Prisma.MassingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MassingPayload>
          }
          aggregate: {
            args: Prisma.MassingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMassing>
          }
          groupBy: {
            args: Prisma.MassingGroupByArgs<ExtArgs>
            result: $Utils.Optional<MassingGroupByOutputType>[]
          }
          count: {
            args: Prisma.MassingCountArgs<ExtArgs>
            result: $Utils.Optional<MassingCountAggregateOutputType> | number
          }
        }
      }
      File: {
        payload: Prisma.$FilePayload<ExtArgs>
        fields: Prisma.FileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFile>
          }
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileCountArgs<ExtArgs>
            result: $Utils.Optional<FileCountAggregateOutputType> | number
          }
        }
      }
      GeospatialCache: {
        payload: Prisma.$GeospatialCachePayload<ExtArgs>
        fields: Prisma.GeospatialCacheFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GeospatialCacheFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GeospatialCacheFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>
          }
          findFirst: {
            args: Prisma.GeospatialCacheFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GeospatialCacheFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>
          }
          findMany: {
            args: Prisma.GeospatialCacheFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>[]
          }
          create: {
            args: Prisma.GeospatialCacheCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>
          }
          createMany: {
            args: Prisma.GeospatialCacheCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GeospatialCacheCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>[]
          }
          delete: {
            args: Prisma.GeospatialCacheDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>
          }
          update: {
            args: Prisma.GeospatialCacheUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>
          }
          deleteMany: {
            args: Prisma.GeospatialCacheDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GeospatialCacheUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GeospatialCacheUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>[]
          }
          upsert: {
            args: Prisma.GeospatialCacheUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeospatialCachePayload>
          }
          aggregate: {
            args: Prisma.GeospatialCacheAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGeospatialCache>
          }
          groupBy: {
            args: Prisma.GeospatialCacheGroupByArgs<ExtArgs>
            result: $Utils.Optional<GeospatialCacheGroupByOutputType>[]
          }
          count: {
            args: Prisma.GeospatialCacheCountArgs<ExtArgs>
            result: $Utils.Optional<GeospatialCacheCountAggregateOutputType> | number
          }
        }
      }
      SketchfabToken: {
        payload: Prisma.$SketchfabTokenPayload<ExtArgs>
        fields: Prisma.SketchfabTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SketchfabTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SketchfabTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>
          }
          findFirst: {
            args: Prisma.SketchfabTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SketchfabTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>
          }
          findMany: {
            args: Prisma.SketchfabTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>[]
          }
          create: {
            args: Prisma.SketchfabTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>
          }
          createMany: {
            args: Prisma.SketchfabTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SketchfabTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>[]
          }
          delete: {
            args: Prisma.SketchfabTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>
          }
          update: {
            args: Prisma.SketchfabTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>
          }
          deleteMany: {
            args: Prisma.SketchfabTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SketchfabTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SketchfabTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>[]
          }
          upsert: {
            args: Prisma.SketchfabTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabTokenPayload>
          }
          aggregate: {
            args: Prisma.SketchfabTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSketchfabToken>
          }
          groupBy: {
            args: Prisma.SketchfabTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<SketchfabTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.SketchfabTokenCountArgs<ExtArgs>
            result: $Utils.Optional<SketchfabTokenCountAggregateOutputType> | number
          }
        }
      }
      SketchfabModel: {
        payload: Prisma.$SketchfabModelPayload<ExtArgs>
        fields: Prisma.SketchfabModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SketchfabModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SketchfabModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>
          }
          findFirst: {
            args: Prisma.SketchfabModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SketchfabModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>
          }
          findMany: {
            args: Prisma.SketchfabModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>[]
          }
          create: {
            args: Prisma.SketchfabModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>
          }
          createMany: {
            args: Prisma.SketchfabModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SketchfabModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>[]
          }
          delete: {
            args: Prisma.SketchfabModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>
          }
          update: {
            args: Prisma.SketchfabModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>
          }
          deleteMany: {
            args: Prisma.SketchfabModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SketchfabModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SketchfabModelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>[]
          }
          upsert: {
            args: Prisma.SketchfabModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SketchfabModelPayload>
          }
          aggregate: {
            args: Prisma.SketchfabModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSketchfabModel>
          }
          groupBy: {
            args: Prisma.SketchfabModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<SketchfabModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.SketchfabModelCountArgs<ExtArgs>
            result: $Utils.Optional<SketchfabModelCountAggregateOutputType> | number
          }
        }
      }
      CadBlock: {
        payload: Prisma.$CadBlockPayload<ExtArgs>
        fields: Prisma.CadBlockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CadBlockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CadBlockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>
          }
          findFirst: {
            args: Prisma.CadBlockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CadBlockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>
          }
          findMany: {
            args: Prisma.CadBlockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>[]
          }
          create: {
            args: Prisma.CadBlockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>
          }
          createMany: {
            args: Prisma.CadBlockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CadBlockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>[]
          }
          delete: {
            args: Prisma.CadBlockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>
          }
          update: {
            args: Prisma.CadBlockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>
          }
          deleteMany: {
            args: Prisma.CadBlockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CadBlockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CadBlockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>[]
          }
          upsert: {
            args: Prisma.CadBlockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CadBlockPayload>
          }
          aggregate: {
            args: Prisma.CadBlockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCadBlock>
          }
          groupBy: {
            args: Prisma.CadBlockGroupByArgs<ExtArgs>
            result: $Utils.Optional<CadBlockGroupByOutputType>[]
          }
          count: {
            args: Prisma.CadBlockCountArgs<ExtArgs>
            result: $Utils.Optional<CadBlockCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    userSession?: UserSessionOmit
    project?: ProjectOmit
    siteAnalysis?: SiteAnalysisOmit
    floorplan?: FloorplanOmit
    model3D?: Model3DOmit
    massing?: MassingOmit
    file?: FileOmit
    geospatialCache?: GeospatialCacheOmit
    sketchfabToken?: SketchfabTokenOmit
    sketchfabModel?: SketchfabModelOmit
    cadBlock?: CadBlockOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    projects: number
    sessions: number
    sketchfabTokens: number
    sketchfabModels: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    sketchfabTokens?: boolean | UserCountOutputTypeCountSketchfabTokensArgs
    sketchfabModels?: boolean | UserCountOutputTypeCountSketchfabModelsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSketchfabTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SketchfabTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSketchfabModelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SketchfabModelWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    floorplans: number
    massings: number
    models3D: number
    sketchfabModels: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    floorplans?: boolean | ProjectCountOutputTypeCountFloorplansArgs
    massings?: boolean | ProjectCountOutputTypeCountMassingsArgs
    models3D?: boolean | ProjectCountOutputTypeCountModels3DArgs
    sketchfabModels?: boolean | ProjectCountOutputTypeCountSketchfabModelsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFloorplansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FloorplanWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMassingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MassingWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountModels3DArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Model3DWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountSketchfabModelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SketchfabModelWhereInput
  }


  /**
   * Count Type FloorplanCountOutputType
   */

  export type FloorplanCountOutputType = {
    models3D: number
  }

  export type FloorplanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    models3D?: boolean | FloorplanCountOutputTypeCountModels3DArgs
  }

  // Custom InputTypes
  /**
   * FloorplanCountOutputType without action
   */
  export type FloorplanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FloorplanCountOutputType
     */
    select?: FloorplanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FloorplanCountOutputType without action
   */
  export type FloorplanCountOutputTypeCountModels3DArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Model3DWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    clerkId: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    clerkId: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    clerkId: number
    email: number
    firstName: number
    lastName: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    firstName?: true
    lastName?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    firstName?: true
    lastName?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    firstName?: true
    lastName?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    clerkId: string
    email: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | User$projectsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    sketchfabTokens?: boolean | User$sketchfabTokensArgs<ExtArgs>
    sketchfabModels?: boolean | User$sketchfabModelsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    clerkId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clerkId" | "email" | "firstName" | "lastName" | "imageUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | User$projectsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    sketchfabTokens?: boolean | User$sketchfabTokensArgs<ExtArgs>
    sketchfabModels?: boolean | User$sketchfabModelsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
      sketchfabTokens: Prisma.$SketchfabTokenPayload<ExtArgs>[]
      sketchfabModels: Prisma.$SketchfabModelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clerkId: string
      email: string
      firstName: string | null
      lastName: string | null
      imageUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sketchfabTokens<T extends User$sketchfabTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$sketchfabTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sketchfabModels<T extends User$sketchfabModelsArgs<ExtArgs> = {}>(args?: Subset<T, User$sketchfabModelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly clerkId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly imageUrl: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User.sketchfabTokens
   */
  export type User$sketchfabTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    where?: SketchfabTokenWhereInput
    orderBy?: SketchfabTokenOrderByWithRelationInput | SketchfabTokenOrderByWithRelationInput[]
    cursor?: SketchfabTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SketchfabTokenScalarFieldEnum | SketchfabTokenScalarFieldEnum[]
  }

  /**
   * User.sketchfabModels
   */
  export type User$sketchfabModelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    where?: SketchfabModelWhereInput
    orderBy?: SketchfabModelOrderByWithRelationInput | SketchfabModelOrderByWithRelationInput[]
    cursor?: SketchfabModelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SketchfabModelScalarFieldEnum | SketchfabModelScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string
    token: string
    expiresAt: Date
    createdAt: Date
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type UserSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "expiresAt" | "createdAt", ExtArgs["result"]["userSession"]>
  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions and returns the data updated in the database.
     * @param {UserSessionUpdateManyAndReturnArgs} args - Arguments to update many UserSessions.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSession model
   */
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly token: FieldRef<"UserSession", 'String'>
    readonly expiresAt: FieldRef<"UserSession", 'DateTime'>
    readonly createdAt: FieldRef<"UserSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
  }

  /**
   * UserSession updateManyAndReturn
   */
  export type UserSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to delete.
     */
    limit?: number
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    description: number
    userId: number
    createdAt: number
    updatedAt: number
    settings: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    settings?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    description: string | null
    userId: string | null
    createdAt: Date
    updatedAt: Date
    settings: JsonValue | null
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
    floorplans?: boolean | Project$floorplansArgs<ExtArgs>
    massings?: boolean | Project$massingsArgs<ExtArgs>
    models3D?: boolean | Project$models3DArgs<ExtArgs>
    user?: boolean | Project$userArgs<ExtArgs>
    siteAnalysis?: boolean | Project$siteAnalysisArgs<ExtArgs>
    sketchfabModels?: boolean | Project$sketchfabModelsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
    user?: boolean | Project$userArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
    user?: boolean | Project$userArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "userId" | "createdAt" | "updatedAt" | "settings", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    floorplans?: boolean | Project$floorplansArgs<ExtArgs>
    massings?: boolean | Project$massingsArgs<ExtArgs>
    models3D?: boolean | Project$models3DArgs<ExtArgs>
    user?: boolean | Project$userArgs<ExtArgs>
    siteAnalysis?: boolean | Project$siteAnalysisArgs<ExtArgs>
    sketchfabModels?: boolean | Project$sketchfabModelsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Project$userArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Project$userArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      floorplans: Prisma.$FloorplanPayload<ExtArgs>[]
      massings: Prisma.$MassingPayload<ExtArgs>[]
      models3D: Prisma.$Model3DPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs> | null
      siteAnalysis: Prisma.$SiteAnalysisPayload<ExtArgs> | null
      sketchfabModels: Prisma.$SketchfabModelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      userId: string | null
      createdAt: Date
      updatedAt: Date
      settings: Prisma.JsonValue | null
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    floorplans<T extends Project$floorplansArgs<ExtArgs> = {}>(args?: Subset<T, Project$floorplansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    massings<T extends Project$massingsArgs<ExtArgs> = {}>(args?: Subset<T, Project$massingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    models3D<T extends Project$models3DArgs<ExtArgs> = {}>(args?: Subset<T, Project$models3DArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends Project$userArgs<ExtArgs> = {}>(args?: Subset<T, Project$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    siteAnalysis<T extends Project$siteAnalysisArgs<ExtArgs> = {}>(args?: Subset<T, Project$siteAnalysisArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sketchfabModels<T extends Project$sketchfabModelsArgs<ExtArgs> = {}>(args?: Subset<T, Project$sketchfabModelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly userId: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly settings: FieldRef<"Project", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.floorplans
   */
  export type Project$floorplansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    where?: FloorplanWhereInput
    orderBy?: FloorplanOrderByWithRelationInput | FloorplanOrderByWithRelationInput[]
    cursor?: FloorplanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FloorplanScalarFieldEnum | FloorplanScalarFieldEnum[]
  }

  /**
   * Project.massings
   */
  export type Project$massingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    where?: MassingWhereInput
    orderBy?: MassingOrderByWithRelationInput | MassingOrderByWithRelationInput[]
    cursor?: MassingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MassingScalarFieldEnum | MassingScalarFieldEnum[]
  }

  /**
   * Project.models3D
   */
  export type Project$models3DArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    where?: Model3DWhereInput
    orderBy?: Model3DOrderByWithRelationInput | Model3DOrderByWithRelationInput[]
    cursor?: Model3DWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Model3DScalarFieldEnum | Model3DScalarFieldEnum[]
  }

  /**
   * Project.user
   */
  export type Project$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Project.siteAnalysis
   */
  export type Project$siteAnalysisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    where?: SiteAnalysisWhereInput
  }

  /**
   * Project.sketchfabModels
   */
  export type Project$sketchfabModelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    where?: SketchfabModelWhereInput
    orderBy?: SketchfabModelOrderByWithRelationInput | SketchfabModelOrderByWithRelationInput[]
    cursor?: SketchfabModelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SketchfabModelScalarFieldEnum | SketchfabModelScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model SiteAnalysis
   */

  export type AggregateSiteAnalysis = {
    _count: SiteAnalysisCountAggregateOutputType | null
    _min: SiteAnalysisMinAggregateOutputType | null
    _max: SiteAnalysisMaxAggregateOutputType | null
  }

  export type SiteAnalysisMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SiteAnalysisMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SiteAnalysisCountAggregateOutputType = {
    id: number
    projectId: number
    createdAt: number
    updatedAt: number
    sunPathData: number
    weatherData: number
    topographyData: number
    contextData: number
    analysisResults: number
    boundary: number
    coordinates: number
    _all: number
  }


  export type SiteAnalysisMinAggregateInputType = {
    id?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SiteAnalysisMaxAggregateInputType = {
    id?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SiteAnalysisCountAggregateInputType = {
    id?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    sunPathData?: true
    weatherData?: true
    topographyData?: true
    contextData?: true
    analysisResults?: true
    boundary?: true
    coordinates?: true
    _all?: true
  }

  export type SiteAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteAnalysis to aggregate.
     */
    where?: SiteAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteAnalyses to fetch.
     */
    orderBy?: SiteAnalysisOrderByWithRelationInput | SiteAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SiteAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SiteAnalyses
    **/
    _count?: true | SiteAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SiteAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SiteAnalysisMaxAggregateInputType
  }

  export type GetSiteAnalysisAggregateType<T extends SiteAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateSiteAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSiteAnalysis[P]>
      : GetScalarType<T[P], AggregateSiteAnalysis[P]>
  }




  export type SiteAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiteAnalysisWhereInput
    orderBy?: SiteAnalysisOrderByWithAggregationInput | SiteAnalysisOrderByWithAggregationInput[]
    by: SiteAnalysisScalarFieldEnum[] | SiteAnalysisScalarFieldEnum
    having?: SiteAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SiteAnalysisCountAggregateInputType | true
    _min?: SiteAnalysisMinAggregateInputType
    _max?: SiteAnalysisMaxAggregateInputType
  }

  export type SiteAnalysisGroupByOutputType = {
    id: string
    projectId: string
    createdAt: Date
    updatedAt: Date
    sunPathData: JsonValue | null
    weatherData: JsonValue | null
    topographyData: JsonValue | null
    contextData: JsonValue | null
    analysisResults: JsonValue | null
    boundary: JsonValue
    coordinates: JsonValue
    _count: SiteAnalysisCountAggregateOutputType | null
    _min: SiteAnalysisMinAggregateOutputType | null
    _max: SiteAnalysisMaxAggregateOutputType | null
  }

  type GetSiteAnalysisGroupByPayload<T extends SiteAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SiteAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SiteAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SiteAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], SiteAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type SiteAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sunPathData?: boolean
    weatherData?: boolean
    topographyData?: boolean
    contextData?: boolean
    analysisResults?: boolean
    boundary?: boolean
    coordinates?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["siteAnalysis"]>

  export type SiteAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sunPathData?: boolean
    weatherData?: boolean
    topographyData?: boolean
    contextData?: boolean
    analysisResults?: boolean
    boundary?: boolean
    coordinates?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["siteAnalysis"]>

  export type SiteAnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sunPathData?: boolean
    weatherData?: boolean
    topographyData?: boolean
    contextData?: boolean
    analysisResults?: boolean
    boundary?: boolean
    coordinates?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["siteAnalysis"]>

  export type SiteAnalysisSelectScalar = {
    id?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sunPathData?: boolean
    weatherData?: boolean
    topographyData?: boolean
    contextData?: boolean
    analysisResults?: boolean
    boundary?: boolean
    coordinates?: boolean
  }

  export type SiteAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "createdAt" | "updatedAt" | "sunPathData" | "weatherData" | "topographyData" | "contextData" | "analysisResults" | "boundary" | "coordinates", ExtArgs["result"]["siteAnalysis"]>
  export type SiteAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type SiteAnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type SiteAnalysisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $SiteAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SiteAnalysis"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      createdAt: Date
      updatedAt: Date
      sunPathData: Prisma.JsonValue | null
      weatherData: Prisma.JsonValue | null
      topographyData: Prisma.JsonValue | null
      contextData: Prisma.JsonValue | null
      analysisResults: Prisma.JsonValue | null
      boundary: Prisma.JsonValue
      coordinates: Prisma.JsonValue
    }, ExtArgs["result"]["siteAnalysis"]>
    composites: {}
  }

  type SiteAnalysisGetPayload<S extends boolean | null | undefined | SiteAnalysisDefaultArgs> = $Result.GetResult<Prisma.$SiteAnalysisPayload, S>

  type SiteAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SiteAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SiteAnalysisCountAggregateInputType | true
    }

  export interface SiteAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SiteAnalysis'], meta: { name: 'SiteAnalysis' } }
    /**
     * Find zero or one SiteAnalysis that matches the filter.
     * @param {SiteAnalysisFindUniqueArgs} args - Arguments to find a SiteAnalysis
     * @example
     * // Get one SiteAnalysis
     * const siteAnalysis = await prisma.siteAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SiteAnalysisFindUniqueArgs>(args: SelectSubset<T, SiteAnalysisFindUniqueArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SiteAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SiteAnalysisFindUniqueOrThrowArgs} args - Arguments to find a SiteAnalysis
     * @example
     * // Get one SiteAnalysis
     * const siteAnalysis = await prisma.siteAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SiteAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, SiteAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisFindFirstArgs} args - Arguments to find a SiteAnalysis
     * @example
     * // Get one SiteAnalysis
     * const siteAnalysis = await prisma.siteAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SiteAnalysisFindFirstArgs>(args?: SelectSubset<T, SiteAnalysisFindFirstArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisFindFirstOrThrowArgs} args - Arguments to find a SiteAnalysis
     * @example
     * // Get one SiteAnalysis
     * const siteAnalysis = await prisma.siteAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SiteAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, SiteAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SiteAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SiteAnalyses
     * const siteAnalyses = await prisma.siteAnalysis.findMany()
     * 
     * // Get first 10 SiteAnalyses
     * const siteAnalyses = await prisma.siteAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const siteAnalysisWithIdOnly = await prisma.siteAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SiteAnalysisFindManyArgs>(args?: SelectSubset<T, SiteAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SiteAnalysis.
     * @param {SiteAnalysisCreateArgs} args - Arguments to create a SiteAnalysis.
     * @example
     * // Create one SiteAnalysis
     * const SiteAnalysis = await prisma.siteAnalysis.create({
     *   data: {
     *     // ... data to create a SiteAnalysis
     *   }
     * })
     * 
     */
    create<T extends SiteAnalysisCreateArgs>(args: SelectSubset<T, SiteAnalysisCreateArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SiteAnalyses.
     * @param {SiteAnalysisCreateManyArgs} args - Arguments to create many SiteAnalyses.
     * @example
     * // Create many SiteAnalyses
     * const siteAnalysis = await prisma.siteAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SiteAnalysisCreateManyArgs>(args?: SelectSubset<T, SiteAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SiteAnalyses and returns the data saved in the database.
     * @param {SiteAnalysisCreateManyAndReturnArgs} args - Arguments to create many SiteAnalyses.
     * @example
     * // Create many SiteAnalyses
     * const siteAnalysis = await prisma.siteAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SiteAnalyses and only return the `id`
     * const siteAnalysisWithIdOnly = await prisma.siteAnalysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SiteAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, SiteAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SiteAnalysis.
     * @param {SiteAnalysisDeleteArgs} args - Arguments to delete one SiteAnalysis.
     * @example
     * // Delete one SiteAnalysis
     * const SiteAnalysis = await prisma.siteAnalysis.delete({
     *   where: {
     *     // ... filter to delete one SiteAnalysis
     *   }
     * })
     * 
     */
    delete<T extends SiteAnalysisDeleteArgs>(args: SelectSubset<T, SiteAnalysisDeleteArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SiteAnalysis.
     * @param {SiteAnalysisUpdateArgs} args - Arguments to update one SiteAnalysis.
     * @example
     * // Update one SiteAnalysis
     * const siteAnalysis = await prisma.siteAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SiteAnalysisUpdateArgs>(args: SelectSubset<T, SiteAnalysisUpdateArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SiteAnalyses.
     * @param {SiteAnalysisDeleteManyArgs} args - Arguments to filter SiteAnalyses to delete.
     * @example
     * // Delete a few SiteAnalyses
     * const { count } = await prisma.siteAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SiteAnalysisDeleteManyArgs>(args?: SelectSubset<T, SiteAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SiteAnalyses
     * const siteAnalysis = await prisma.siteAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SiteAnalysisUpdateManyArgs>(args: SelectSubset<T, SiteAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteAnalyses and returns the data updated in the database.
     * @param {SiteAnalysisUpdateManyAndReturnArgs} args - Arguments to update many SiteAnalyses.
     * @example
     * // Update many SiteAnalyses
     * const siteAnalysis = await prisma.siteAnalysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SiteAnalyses and only return the `id`
     * const siteAnalysisWithIdOnly = await prisma.siteAnalysis.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SiteAnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, SiteAnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SiteAnalysis.
     * @param {SiteAnalysisUpsertArgs} args - Arguments to update or create a SiteAnalysis.
     * @example
     * // Update or create a SiteAnalysis
     * const siteAnalysis = await prisma.siteAnalysis.upsert({
     *   create: {
     *     // ... data to create a SiteAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SiteAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends SiteAnalysisUpsertArgs>(args: SelectSubset<T, SiteAnalysisUpsertArgs<ExtArgs>>): Prisma__SiteAnalysisClient<$Result.GetResult<Prisma.$SiteAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SiteAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisCountArgs} args - Arguments to filter SiteAnalyses to count.
     * @example
     * // Count the number of SiteAnalyses
     * const count = await prisma.siteAnalysis.count({
     *   where: {
     *     // ... the filter for the SiteAnalyses we want to count
     *   }
     * })
    **/
    count<T extends SiteAnalysisCountArgs>(
      args?: Subset<T, SiteAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SiteAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SiteAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SiteAnalysisAggregateArgs>(args: Subset<T, SiteAnalysisAggregateArgs>): Prisma.PrismaPromise<GetSiteAnalysisAggregateType<T>>

    /**
     * Group by SiteAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteAnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SiteAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SiteAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: SiteAnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SiteAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSiteAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SiteAnalysis model
   */
  readonly fields: SiteAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SiteAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SiteAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SiteAnalysis model
   */
  interface SiteAnalysisFieldRefs {
    readonly id: FieldRef<"SiteAnalysis", 'String'>
    readonly projectId: FieldRef<"SiteAnalysis", 'String'>
    readonly createdAt: FieldRef<"SiteAnalysis", 'DateTime'>
    readonly updatedAt: FieldRef<"SiteAnalysis", 'DateTime'>
    readonly sunPathData: FieldRef<"SiteAnalysis", 'Json'>
    readonly weatherData: FieldRef<"SiteAnalysis", 'Json'>
    readonly topographyData: FieldRef<"SiteAnalysis", 'Json'>
    readonly contextData: FieldRef<"SiteAnalysis", 'Json'>
    readonly analysisResults: FieldRef<"SiteAnalysis", 'Json'>
    readonly boundary: FieldRef<"SiteAnalysis", 'Json'>
    readonly coordinates: FieldRef<"SiteAnalysis", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * SiteAnalysis findUnique
   */
  export type SiteAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SiteAnalysis to fetch.
     */
    where: SiteAnalysisWhereUniqueInput
  }

  /**
   * SiteAnalysis findUniqueOrThrow
   */
  export type SiteAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SiteAnalysis to fetch.
     */
    where: SiteAnalysisWhereUniqueInput
  }

  /**
   * SiteAnalysis findFirst
   */
  export type SiteAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SiteAnalysis to fetch.
     */
    where?: SiteAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteAnalyses to fetch.
     */
    orderBy?: SiteAnalysisOrderByWithRelationInput | SiteAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteAnalyses.
     */
    cursor?: SiteAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteAnalyses.
     */
    distinct?: SiteAnalysisScalarFieldEnum | SiteAnalysisScalarFieldEnum[]
  }

  /**
   * SiteAnalysis findFirstOrThrow
   */
  export type SiteAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SiteAnalysis to fetch.
     */
    where?: SiteAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteAnalyses to fetch.
     */
    orderBy?: SiteAnalysisOrderByWithRelationInput | SiteAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteAnalyses.
     */
    cursor?: SiteAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteAnalyses.
     */
    distinct?: SiteAnalysisScalarFieldEnum | SiteAnalysisScalarFieldEnum[]
  }

  /**
   * SiteAnalysis findMany
   */
  export type SiteAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SiteAnalyses to fetch.
     */
    where?: SiteAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteAnalyses to fetch.
     */
    orderBy?: SiteAnalysisOrderByWithRelationInput | SiteAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SiteAnalyses.
     */
    cursor?: SiteAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteAnalyses.
     */
    skip?: number
    distinct?: SiteAnalysisScalarFieldEnum | SiteAnalysisScalarFieldEnum[]
  }

  /**
   * SiteAnalysis create
   */
  export type SiteAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a SiteAnalysis.
     */
    data: XOR<SiteAnalysisCreateInput, SiteAnalysisUncheckedCreateInput>
  }

  /**
   * SiteAnalysis createMany
   */
  export type SiteAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SiteAnalyses.
     */
    data: SiteAnalysisCreateManyInput | SiteAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SiteAnalysis createManyAndReturn
   */
  export type SiteAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many SiteAnalyses.
     */
    data: SiteAnalysisCreateManyInput | SiteAnalysisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SiteAnalysis update
   */
  export type SiteAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a SiteAnalysis.
     */
    data: XOR<SiteAnalysisUpdateInput, SiteAnalysisUncheckedUpdateInput>
    /**
     * Choose, which SiteAnalysis to update.
     */
    where: SiteAnalysisWhereUniqueInput
  }

  /**
   * SiteAnalysis updateMany
   */
  export type SiteAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SiteAnalyses.
     */
    data: XOR<SiteAnalysisUpdateManyMutationInput, SiteAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SiteAnalyses to update
     */
    where?: SiteAnalysisWhereInput
    /**
     * Limit how many SiteAnalyses to update.
     */
    limit?: number
  }

  /**
   * SiteAnalysis updateManyAndReturn
   */
  export type SiteAnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * The data used to update SiteAnalyses.
     */
    data: XOR<SiteAnalysisUpdateManyMutationInput, SiteAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SiteAnalyses to update
     */
    where?: SiteAnalysisWhereInput
    /**
     * Limit how many SiteAnalyses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SiteAnalysis upsert
   */
  export type SiteAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the SiteAnalysis to update in case it exists.
     */
    where: SiteAnalysisWhereUniqueInput
    /**
     * In case the SiteAnalysis found by the `where` argument doesn't exist, create a new SiteAnalysis with this data.
     */
    create: XOR<SiteAnalysisCreateInput, SiteAnalysisUncheckedCreateInput>
    /**
     * In case the SiteAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SiteAnalysisUpdateInput, SiteAnalysisUncheckedUpdateInput>
  }

  /**
   * SiteAnalysis delete
   */
  export type SiteAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
    /**
     * Filter which SiteAnalysis to delete.
     */
    where: SiteAnalysisWhereUniqueInput
  }

  /**
   * SiteAnalysis deleteMany
   */
  export type SiteAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteAnalyses to delete
     */
    where?: SiteAnalysisWhereInput
    /**
     * Limit how many SiteAnalyses to delete.
     */
    limit?: number
  }

  /**
   * SiteAnalysis without action
   */
  export type SiteAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteAnalysis
     */
    select?: SiteAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteAnalysis
     */
    omit?: SiteAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SiteAnalysisInclude<ExtArgs> | null
  }


  /**
   * Model Floorplan
   */

  export type AggregateFloorplan = {
    _count: FloorplanCountAggregateOutputType | null
    _avg: FloorplanAvgAggregateOutputType | null
    _sum: FloorplanSumAggregateOutputType | null
    _min: FloorplanMinAggregateOutputType | null
    _max: FloorplanMaxAggregateOutputType | null
  }

  export type FloorplanAvgAggregateOutputType = {
    level: number | null
  }

  export type FloorplanSumAggregateOutputType = {
    level: number | null
  }

  export type FloorplanMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    level: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FloorplanMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    level: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FloorplanCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    level: number
    createdAt: number
    updatedAt: number
    data: number
    _all: number
  }


  export type FloorplanAvgAggregateInputType = {
    level?: true
  }

  export type FloorplanSumAggregateInputType = {
    level?: true
  }

  export type FloorplanMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    level?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FloorplanMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    level?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FloorplanCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    level?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    _all?: true
  }

  export type FloorplanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Floorplan to aggregate.
     */
    where?: FloorplanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Floorplans to fetch.
     */
    orderBy?: FloorplanOrderByWithRelationInput | FloorplanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FloorplanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Floorplans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Floorplans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Floorplans
    **/
    _count?: true | FloorplanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FloorplanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FloorplanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FloorplanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FloorplanMaxAggregateInputType
  }

  export type GetFloorplanAggregateType<T extends FloorplanAggregateArgs> = {
        [P in keyof T & keyof AggregateFloorplan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFloorplan[P]>
      : GetScalarType<T[P], AggregateFloorplan[P]>
  }




  export type FloorplanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FloorplanWhereInput
    orderBy?: FloorplanOrderByWithAggregationInput | FloorplanOrderByWithAggregationInput[]
    by: FloorplanScalarFieldEnum[] | FloorplanScalarFieldEnum
    having?: FloorplanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FloorplanCountAggregateInputType | true
    _avg?: FloorplanAvgAggregateInputType
    _sum?: FloorplanSumAggregateInputType
    _min?: FloorplanMinAggregateInputType
    _max?: FloorplanMaxAggregateInputType
  }

  export type FloorplanGroupByOutputType = {
    id: string
    projectId: string
    name: string
    level: number
    createdAt: Date
    updatedAt: Date
    data: JsonValue
    _count: FloorplanCountAggregateOutputType | null
    _avg: FloorplanAvgAggregateOutputType | null
    _sum: FloorplanSumAggregateOutputType | null
    _min: FloorplanMinAggregateOutputType | null
    _max: FloorplanMaxAggregateOutputType | null
  }

  type GetFloorplanGroupByPayload<T extends FloorplanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FloorplanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FloorplanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FloorplanGroupByOutputType[P]>
            : GetScalarType<T[P], FloorplanGroupByOutputType[P]>
        }
      >
    >


  export type FloorplanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    models3D?: boolean | Floorplan$models3DArgs<ExtArgs>
    _count?: boolean | FloorplanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["floorplan"]>

  export type FloorplanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["floorplan"]>

  export type FloorplanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["floorplan"]>

  export type FloorplanSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    level?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
  }

  export type FloorplanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "name" | "level" | "createdAt" | "updatedAt" | "data", ExtArgs["result"]["floorplan"]>
  export type FloorplanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    models3D?: boolean | Floorplan$models3DArgs<ExtArgs>
    _count?: boolean | FloorplanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FloorplanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type FloorplanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $FloorplanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Floorplan"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      models3D: Prisma.$Model3DPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      level: number
      createdAt: Date
      updatedAt: Date
      data: Prisma.JsonValue
    }, ExtArgs["result"]["floorplan"]>
    composites: {}
  }

  type FloorplanGetPayload<S extends boolean | null | undefined | FloorplanDefaultArgs> = $Result.GetResult<Prisma.$FloorplanPayload, S>

  type FloorplanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FloorplanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FloorplanCountAggregateInputType | true
    }

  export interface FloorplanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Floorplan'], meta: { name: 'Floorplan' } }
    /**
     * Find zero or one Floorplan that matches the filter.
     * @param {FloorplanFindUniqueArgs} args - Arguments to find a Floorplan
     * @example
     * // Get one Floorplan
     * const floorplan = await prisma.floorplan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FloorplanFindUniqueArgs>(args: SelectSubset<T, FloorplanFindUniqueArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Floorplan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FloorplanFindUniqueOrThrowArgs} args - Arguments to find a Floorplan
     * @example
     * // Get one Floorplan
     * const floorplan = await prisma.floorplan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FloorplanFindUniqueOrThrowArgs>(args: SelectSubset<T, FloorplanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Floorplan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanFindFirstArgs} args - Arguments to find a Floorplan
     * @example
     * // Get one Floorplan
     * const floorplan = await prisma.floorplan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FloorplanFindFirstArgs>(args?: SelectSubset<T, FloorplanFindFirstArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Floorplan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanFindFirstOrThrowArgs} args - Arguments to find a Floorplan
     * @example
     * // Get one Floorplan
     * const floorplan = await prisma.floorplan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FloorplanFindFirstOrThrowArgs>(args?: SelectSubset<T, FloorplanFindFirstOrThrowArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Floorplans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Floorplans
     * const floorplans = await prisma.floorplan.findMany()
     * 
     * // Get first 10 Floorplans
     * const floorplans = await prisma.floorplan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const floorplanWithIdOnly = await prisma.floorplan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FloorplanFindManyArgs>(args?: SelectSubset<T, FloorplanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Floorplan.
     * @param {FloorplanCreateArgs} args - Arguments to create a Floorplan.
     * @example
     * // Create one Floorplan
     * const Floorplan = await prisma.floorplan.create({
     *   data: {
     *     // ... data to create a Floorplan
     *   }
     * })
     * 
     */
    create<T extends FloorplanCreateArgs>(args: SelectSubset<T, FloorplanCreateArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Floorplans.
     * @param {FloorplanCreateManyArgs} args - Arguments to create many Floorplans.
     * @example
     * // Create many Floorplans
     * const floorplan = await prisma.floorplan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FloorplanCreateManyArgs>(args?: SelectSubset<T, FloorplanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Floorplans and returns the data saved in the database.
     * @param {FloorplanCreateManyAndReturnArgs} args - Arguments to create many Floorplans.
     * @example
     * // Create many Floorplans
     * const floorplan = await prisma.floorplan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Floorplans and only return the `id`
     * const floorplanWithIdOnly = await prisma.floorplan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FloorplanCreateManyAndReturnArgs>(args?: SelectSubset<T, FloorplanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Floorplan.
     * @param {FloorplanDeleteArgs} args - Arguments to delete one Floorplan.
     * @example
     * // Delete one Floorplan
     * const Floorplan = await prisma.floorplan.delete({
     *   where: {
     *     // ... filter to delete one Floorplan
     *   }
     * })
     * 
     */
    delete<T extends FloorplanDeleteArgs>(args: SelectSubset<T, FloorplanDeleteArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Floorplan.
     * @param {FloorplanUpdateArgs} args - Arguments to update one Floorplan.
     * @example
     * // Update one Floorplan
     * const floorplan = await prisma.floorplan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FloorplanUpdateArgs>(args: SelectSubset<T, FloorplanUpdateArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Floorplans.
     * @param {FloorplanDeleteManyArgs} args - Arguments to filter Floorplans to delete.
     * @example
     * // Delete a few Floorplans
     * const { count } = await prisma.floorplan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FloorplanDeleteManyArgs>(args?: SelectSubset<T, FloorplanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Floorplans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Floorplans
     * const floorplan = await prisma.floorplan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FloorplanUpdateManyArgs>(args: SelectSubset<T, FloorplanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Floorplans and returns the data updated in the database.
     * @param {FloorplanUpdateManyAndReturnArgs} args - Arguments to update many Floorplans.
     * @example
     * // Update many Floorplans
     * const floorplan = await prisma.floorplan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Floorplans and only return the `id`
     * const floorplanWithIdOnly = await prisma.floorplan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FloorplanUpdateManyAndReturnArgs>(args: SelectSubset<T, FloorplanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Floorplan.
     * @param {FloorplanUpsertArgs} args - Arguments to update or create a Floorplan.
     * @example
     * // Update or create a Floorplan
     * const floorplan = await prisma.floorplan.upsert({
     *   create: {
     *     // ... data to create a Floorplan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Floorplan we want to update
     *   }
     * })
     */
    upsert<T extends FloorplanUpsertArgs>(args: SelectSubset<T, FloorplanUpsertArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Floorplans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanCountArgs} args - Arguments to filter Floorplans to count.
     * @example
     * // Count the number of Floorplans
     * const count = await prisma.floorplan.count({
     *   where: {
     *     // ... the filter for the Floorplans we want to count
     *   }
     * })
    **/
    count<T extends FloorplanCountArgs>(
      args?: Subset<T, FloorplanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FloorplanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Floorplan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FloorplanAggregateArgs>(args: Subset<T, FloorplanAggregateArgs>): Prisma.PrismaPromise<GetFloorplanAggregateType<T>>

    /**
     * Group by Floorplan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FloorplanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FloorplanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FloorplanGroupByArgs['orderBy'] }
        : { orderBy?: FloorplanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FloorplanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFloorplanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Floorplan model
   */
  readonly fields: FloorplanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Floorplan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FloorplanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    models3D<T extends Floorplan$models3DArgs<ExtArgs> = {}>(args?: Subset<T, Floorplan$models3DArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Floorplan model
   */
  interface FloorplanFieldRefs {
    readonly id: FieldRef<"Floorplan", 'String'>
    readonly projectId: FieldRef<"Floorplan", 'String'>
    readonly name: FieldRef<"Floorplan", 'String'>
    readonly level: FieldRef<"Floorplan", 'Int'>
    readonly createdAt: FieldRef<"Floorplan", 'DateTime'>
    readonly updatedAt: FieldRef<"Floorplan", 'DateTime'>
    readonly data: FieldRef<"Floorplan", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Floorplan findUnique
   */
  export type FloorplanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * Filter, which Floorplan to fetch.
     */
    where: FloorplanWhereUniqueInput
  }

  /**
   * Floorplan findUniqueOrThrow
   */
  export type FloorplanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * Filter, which Floorplan to fetch.
     */
    where: FloorplanWhereUniqueInput
  }

  /**
   * Floorplan findFirst
   */
  export type FloorplanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * Filter, which Floorplan to fetch.
     */
    where?: FloorplanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Floorplans to fetch.
     */
    orderBy?: FloorplanOrderByWithRelationInput | FloorplanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Floorplans.
     */
    cursor?: FloorplanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Floorplans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Floorplans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Floorplans.
     */
    distinct?: FloorplanScalarFieldEnum | FloorplanScalarFieldEnum[]
  }

  /**
   * Floorplan findFirstOrThrow
   */
  export type FloorplanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * Filter, which Floorplan to fetch.
     */
    where?: FloorplanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Floorplans to fetch.
     */
    orderBy?: FloorplanOrderByWithRelationInput | FloorplanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Floorplans.
     */
    cursor?: FloorplanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Floorplans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Floorplans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Floorplans.
     */
    distinct?: FloorplanScalarFieldEnum | FloorplanScalarFieldEnum[]
  }

  /**
   * Floorplan findMany
   */
  export type FloorplanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * Filter, which Floorplans to fetch.
     */
    where?: FloorplanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Floorplans to fetch.
     */
    orderBy?: FloorplanOrderByWithRelationInput | FloorplanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Floorplans.
     */
    cursor?: FloorplanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Floorplans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Floorplans.
     */
    skip?: number
    distinct?: FloorplanScalarFieldEnum | FloorplanScalarFieldEnum[]
  }

  /**
   * Floorplan create
   */
  export type FloorplanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * The data needed to create a Floorplan.
     */
    data: XOR<FloorplanCreateInput, FloorplanUncheckedCreateInput>
  }

  /**
   * Floorplan createMany
   */
  export type FloorplanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Floorplans.
     */
    data: FloorplanCreateManyInput | FloorplanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Floorplan createManyAndReturn
   */
  export type FloorplanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * The data used to create many Floorplans.
     */
    data: FloorplanCreateManyInput | FloorplanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Floorplan update
   */
  export type FloorplanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * The data needed to update a Floorplan.
     */
    data: XOR<FloorplanUpdateInput, FloorplanUncheckedUpdateInput>
    /**
     * Choose, which Floorplan to update.
     */
    where: FloorplanWhereUniqueInput
  }

  /**
   * Floorplan updateMany
   */
  export type FloorplanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Floorplans.
     */
    data: XOR<FloorplanUpdateManyMutationInput, FloorplanUncheckedUpdateManyInput>
    /**
     * Filter which Floorplans to update
     */
    where?: FloorplanWhereInput
    /**
     * Limit how many Floorplans to update.
     */
    limit?: number
  }

  /**
   * Floorplan updateManyAndReturn
   */
  export type FloorplanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * The data used to update Floorplans.
     */
    data: XOR<FloorplanUpdateManyMutationInput, FloorplanUncheckedUpdateManyInput>
    /**
     * Filter which Floorplans to update
     */
    where?: FloorplanWhereInput
    /**
     * Limit how many Floorplans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Floorplan upsert
   */
  export type FloorplanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * The filter to search for the Floorplan to update in case it exists.
     */
    where: FloorplanWhereUniqueInput
    /**
     * In case the Floorplan found by the `where` argument doesn't exist, create a new Floorplan with this data.
     */
    create: XOR<FloorplanCreateInput, FloorplanUncheckedCreateInput>
    /**
     * In case the Floorplan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FloorplanUpdateInput, FloorplanUncheckedUpdateInput>
  }

  /**
   * Floorplan delete
   */
  export type FloorplanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    /**
     * Filter which Floorplan to delete.
     */
    where: FloorplanWhereUniqueInput
  }

  /**
   * Floorplan deleteMany
   */
  export type FloorplanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Floorplans to delete
     */
    where?: FloorplanWhereInput
    /**
     * Limit how many Floorplans to delete.
     */
    limit?: number
  }

  /**
   * Floorplan.models3D
   */
  export type Floorplan$models3DArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    where?: Model3DWhereInput
    orderBy?: Model3DOrderByWithRelationInput | Model3DOrderByWithRelationInput[]
    cursor?: Model3DWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Model3DScalarFieldEnum | Model3DScalarFieldEnum[]
  }

  /**
   * Floorplan without action
   */
  export type FloorplanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
  }


  /**
   * Model Model3D
   */

  export type AggregateModel3D = {
    _count: Model3DCountAggregateOutputType | null
    _min: Model3DMinAggregateOutputType | null
    _max: Model3DMaxAggregateOutputType | null
  }

  export type Model3DMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    floorplanId: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Model3DMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    floorplanId: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Model3DCountAggregateOutputType = {
    id: number
    projectId: number
    floorplanId: number
    name: number
    createdAt: number
    updatedAt: number
    modelData: number
    settings: number
    _all: number
  }


  export type Model3DMinAggregateInputType = {
    id?: true
    projectId?: true
    floorplanId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Model3DMaxAggregateInputType = {
    id?: true
    projectId?: true
    floorplanId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Model3DCountAggregateInputType = {
    id?: true
    projectId?: true
    floorplanId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    modelData?: true
    settings?: true
    _all?: true
  }

  export type Model3DAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Model3D to aggregate.
     */
    where?: Model3DWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Model3DS to fetch.
     */
    orderBy?: Model3DOrderByWithRelationInput | Model3DOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Model3DWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Model3DS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Model3DS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Model3DS
    **/
    _count?: true | Model3DCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Model3DMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Model3DMaxAggregateInputType
  }

  export type GetModel3DAggregateType<T extends Model3DAggregateArgs> = {
        [P in keyof T & keyof AggregateModel3D]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModel3D[P]>
      : GetScalarType<T[P], AggregateModel3D[P]>
  }




  export type Model3DGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Model3DWhereInput
    orderBy?: Model3DOrderByWithAggregationInput | Model3DOrderByWithAggregationInput[]
    by: Model3DScalarFieldEnum[] | Model3DScalarFieldEnum
    having?: Model3DScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Model3DCountAggregateInputType | true
    _min?: Model3DMinAggregateInputType
    _max?: Model3DMaxAggregateInputType
  }

  export type Model3DGroupByOutputType = {
    id: string
    projectId: string
    floorplanId: string | null
    name: string
    createdAt: Date
    updatedAt: Date
    modelData: JsonValue
    settings: JsonValue | null
    _count: Model3DCountAggregateOutputType | null
    _min: Model3DMinAggregateOutputType | null
    _max: Model3DMaxAggregateOutputType | null
  }

  type GetModel3DGroupByPayload<T extends Model3DGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Model3DGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Model3DGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Model3DGroupByOutputType[P]>
            : GetScalarType<T[P], Model3DGroupByOutputType[P]>
        }
      >
    >


  export type Model3DSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    floorplanId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modelData?: boolean
    settings?: boolean
    floorplan?: boolean | Model3D$floorplanArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["model3D"]>

  export type Model3DSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    floorplanId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modelData?: boolean
    settings?: boolean
    floorplan?: boolean | Model3D$floorplanArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["model3D"]>

  export type Model3DSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    floorplanId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modelData?: boolean
    settings?: boolean
    floorplan?: boolean | Model3D$floorplanArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["model3D"]>

  export type Model3DSelectScalar = {
    id?: boolean
    projectId?: boolean
    floorplanId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modelData?: boolean
    settings?: boolean
  }

  export type Model3DOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "floorplanId" | "name" | "createdAt" | "updatedAt" | "modelData" | "settings", ExtArgs["result"]["model3D"]>
  export type Model3DInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    floorplan?: boolean | Model3D$floorplanArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type Model3DIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    floorplan?: boolean | Model3D$floorplanArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type Model3DIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    floorplan?: boolean | Model3D$floorplanArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $Model3DPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Model3D"
    objects: {
      floorplan: Prisma.$FloorplanPayload<ExtArgs> | null
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      floorplanId: string | null
      name: string
      createdAt: Date
      updatedAt: Date
      modelData: Prisma.JsonValue
      settings: Prisma.JsonValue | null
    }, ExtArgs["result"]["model3D"]>
    composites: {}
  }

  type Model3DGetPayload<S extends boolean | null | undefined | Model3DDefaultArgs> = $Result.GetResult<Prisma.$Model3DPayload, S>

  type Model3DCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<Model3DFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Model3DCountAggregateInputType | true
    }

  export interface Model3DDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Model3D'], meta: { name: 'Model3D' } }
    /**
     * Find zero or one Model3D that matches the filter.
     * @param {Model3DFindUniqueArgs} args - Arguments to find a Model3D
     * @example
     * // Get one Model3D
     * const model3D = await prisma.model3D.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Model3DFindUniqueArgs>(args: SelectSubset<T, Model3DFindUniqueArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Model3D that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Model3DFindUniqueOrThrowArgs} args - Arguments to find a Model3D
     * @example
     * // Get one Model3D
     * const model3D = await prisma.model3D.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Model3DFindUniqueOrThrowArgs>(args: SelectSubset<T, Model3DFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Model3D that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DFindFirstArgs} args - Arguments to find a Model3D
     * @example
     * // Get one Model3D
     * const model3D = await prisma.model3D.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Model3DFindFirstArgs>(args?: SelectSubset<T, Model3DFindFirstArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Model3D that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DFindFirstOrThrowArgs} args - Arguments to find a Model3D
     * @example
     * // Get one Model3D
     * const model3D = await prisma.model3D.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Model3DFindFirstOrThrowArgs>(args?: SelectSubset<T, Model3DFindFirstOrThrowArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Model3DS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Model3DS
     * const model3DS = await prisma.model3D.findMany()
     * 
     * // Get first 10 Model3DS
     * const model3DS = await prisma.model3D.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const model3DWithIdOnly = await prisma.model3D.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends Model3DFindManyArgs>(args?: SelectSubset<T, Model3DFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Model3D.
     * @param {Model3DCreateArgs} args - Arguments to create a Model3D.
     * @example
     * // Create one Model3D
     * const Model3D = await prisma.model3D.create({
     *   data: {
     *     // ... data to create a Model3D
     *   }
     * })
     * 
     */
    create<T extends Model3DCreateArgs>(args: SelectSubset<T, Model3DCreateArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Model3DS.
     * @param {Model3DCreateManyArgs} args - Arguments to create many Model3DS.
     * @example
     * // Create many Model3DS
     * const model3D = await prisma.model3D.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Model3DCreateManyArgs>(args?: SelectSubset<T, Model3DCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Model3DS and returns the data saved in the database.
     * @param {Model3DCreateManyAndReturnArgs} args - Arguments to create many Model3DS.
     * @example
     * // Create many Model3DS
     * const model3D = await prisma.model3D.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Model3DS and only return the `id`
     * const model3DWithIdOnly = await prisma.model3D.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends Model3DCreateManyAndReturnArgs>(args?: SelectSubset<T, Model3DCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Model3D.
     * @param {Model3DDeleteArgs} args - Arguments to delete one Model3D.
     * @example
     * // Delete one Model3D
     * const Model3D = await prisma.model3D.delete({
     *   where: {
     *     // ... filter to delete one Model3D
     *   }
     * })
     * 
     */
    delete<T extends Model3DDeleteArgs>(args: SelectSubset<T, Model3DDeleteArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Model3D.
     * @param {Model3DUpdateArgs} args - Arguments to update one Model3D.
     * @example
     * // Update one Model3D
     * const model3D = await prisma.model3D.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Model3DUpdateArgs>(args: SelectSubset<T, Model3DUpdateArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Model3DS.
     * @param {Model3DDeleteManyArgs} args - Arguments to filter Model3DS to delete.
     * @example
     * // Delete a few Model3DS
     * const { count } = await prisma.model3D.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Model3DDeleteManyArgs>(args?: SelectSubset<T, Model3DDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Model3DS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Model3DS
     * const model3D = await prisma.model3D.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Model3DUpdateManyArgs>(args: SelectSubset<T, Model3DUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Model3DS and returns the data updated in the database.
     * @param {Model3DUpdateManyAndReturnArgs} args - Arguments to update many Model3DS.
     * @example
     * // Update many Model3DS
     * const model3D = await prisma.model3D.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Model3DS and only return the `id`
     * const model3DWithIdOnly = await prisma.model3D.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends Model3DUpdateManyAndReturnArgs>(args: SelectSubset<T, Model3DUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Model3D.
     * @param {Model3DUpsertArgs} args - Arguments to update or create a Model3D.
     * @example
     * // Update or create a Model3D
     * const model3D = await prisma.model3D.upsert({
     *   create: {
     *     // ... data to create a Model3D
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Model3D we want to update
     *   }
     * })
     */
    upsert<T extends Model3DUpsertArgs>(args: SelectSubset<T, Model3DUpsertArgs<ExtArgs>>): Prisma__Model3DClient<$Result.GetResult<Prisma.$Model3DPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Model3DS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DCountArgs} args - Arguments to filter Model3DS to count.
     * @example
     * // Count the number of Model3DS
     * const count = await prisma.model3D.count({
     *   where: {
     *     // ... the filter for the Model3DS we want to count
     *   }
     * })
    **/
    count<T extends Model3DCountArgs>(
      args?: Subset<T, Model3DCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Model3DCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Model3D.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Model3DAggregateArgs>(args: Subset<T, Model3DAggregateArgs>): Prisma.PrismaPromise<GetModel3DAggregateType<T>>

    /**
     * Group by Model3D.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Model3DGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Model3DGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Model3DGroupByArgs['orderBy'] }
        : { orderBy?: Model3DGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Model3DGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModel3DGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Model3D model
   */
  readonly fields: Model3DFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Model3D.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Model3DClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    floorplan<T extends Model3D$floorplanArgs<ExtArgs> = {}>(args?: Subset<T, Model3D$floorplanArgs<ExtArgs>>): Prisma__FloorplanClient<$Result.GetResult<Prisma.$FloorplanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Model3D model
   */
  interface Model3DFieldRefs {
    readonly id: FieldRef<"Model3D", 'String'>
    readonly projectId: FieldRef<"Model3D", 'String'>
    readonly floorplanId: FieldRef<"Model3D", 'String'>
    readonly name: FieldRef<"Model3D", 'String'>
    readonly createdAt: FieldRef<"Model3D", 'DateTime'>
    readonly updatedAt: FieldRef<"Model3D", 'DateTime'>
    readonly modelData: FieldRef<"Model3D", 'Json'>
    readonly settings: FieldRef<"Model3D", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Model3D findUnique
   */
  export type Model3DFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * Filter, which Model3D to fetch.
     */
    where: Model3DWhereUniqueInput
  }

  /**
   * Model3D findUniqueOrThrow
   */
  export type Model3DFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * Filter, which Model3D to fetch.
     */
    where: Model3DWhereUniqueInput
  }

  /**
   * Model3D findFirst
   */
  export type Model3DFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * Filter, which Model3D to fetch.
     */
    where?: Model3DWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Model3DS to fetch.
     */
    orderBy?: Model3DOrderByWithRelationInput | Model3DOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Model3DS.
     */
    cursor?: Model3DWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Model3DS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Model3DS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Model3DS.
     */
    distinct?: Model3DScalarFieldEnum | Model3DScalarFieldEnum[]
  }

  /**
   * Model3D findFirstOrThrow
   */
  export type Model3DFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * Filter, which Model3D to fetch.
     */
    where?: Model3DWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Model3DS to fetch.
     */
    orderBy?: Model3DOrderByWithRelationInput | Model3DOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Model3DS.
     */
    cursor?: Model3DWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Model3DS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Model3DS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Model3DS.
     */
    distinct?: Model3DScalarFieldEnum | Model3DScalarFieldEnum[]
  }

  /**
   * Model3D findMany
   */
  export type Model3DFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * Filter, which Model3DS to fetch.
     */
    where?: Model3DWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Model3DS to fetch.
     */
    orderBy?: Model3DOrderByWithRelationInput | Model3DOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Model3DS.
     */
    cursor?: Model3DWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Model3DS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Model3DS.
     */
    skip?: number
    distinct?: Model3DScalarFieldEnum | Model3DScalarFieldEnum[]
  }

  /**
   * Model3D create
   */
  export type Model3DCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * The data needed to create a Model3D.
     */
    data: XOR<Model3DCreateInput, Model3DUncheckedCreateInput>
  }

  /**
   * Model3D createMany
   */
  export type Model3DCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Model3DS.
     */
    data: Model3DCreateManyInput | Model3DCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Model3D createManyAndReturn
   */
  export type Model3DCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * The data used to create many Model3DS.
     */
    data: Model3DCreateManyInput | Model3DCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Model3D update
   */
  export type Model3DUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * The data needed to update a Model3D.
     */
    data: XOR<Model3DUpdateInput, Model3DUncheckedUpdateInput>
    /**
     * Choose, which Model3D to update.
     */
    where: Model3DWhereUniqueInput
  }

  /**
   * Model3D updateMany
   */
  export type Model3DUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Model3DS.
     */
    data: XOR<Model3DUpdateManyMutationInput, Model3DUncheckedUpdateManyInput>
    /**
     * Filter which Model3DS to update
     */
    where?: Model3DWhereInput
    /**
     * Limit how many Model3DS to update.
     */
    limit?: number
  }

  /**
   * Model3D updateManyAndReturn
   */
  export type Model3DUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * The data used to update Model3DS.
     */
    data: XOR<Model3DUpdateManyMutationInput, Model3DUncheckedUpdateManyInput>
    /**
     * Filter which Model3DS to update
     */
    where?: Model3DWhereInput
    /**
     * Limit how many Model3DS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Model3D upsert
   */
  export type Model3DUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * The filter to search for the Model3D to update in case it exists.
     */
    where: Model3DWhereUniqueInput
    /**
     * In case the Model3D found by the `where` argument doesn't exist, create a new Model3D with this data.
     */
    create: XOR<Model3DCreateInput, Model3DUncheckedCreateInput>
    /**
     * In case the Model3D was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Model3DUpdateInput, Model3DUncheckedUpdateInput>
  }

  /**
   * Model3D delete
   */
  export type Model3DDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
    /**
     * Filter which Model3D to delete.
     */
    where: Model3DWhereUniqueInput
  }

  /**
   * Model3D deleteMany
   */
  export type Model3DDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Model3DS to delete
     */
    where?: Model3DWhereInput
    /**
     * Limit how many Model3DS to delete.
     */
    limit?: number
  }

  /**
   * Model3D.floorplan
   */
  export type Model3D$floorplanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Floorplan
     */
    select?: FloorplanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Floorplan
     */
    omit?: FloorplanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FloorplanInclude<ExtArgs> | null
    where?: FloorplanWhereInput
  }

  /**
   * Model3D without action
   */
  export type Model3DDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Model3D
     */
    select?: Model3DSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Model3D
     */
    omit?: Model3DOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Model3DInclude<ExtArgs> | null
  }


  /**
   * Model Massing
   */

  export type AggregateMassing = {
    _count: MassingCountAggregateOutputType | null
    _min: MassingMinAggregateOutputType | null
    _max: MassingMaxAggregateOutputType | null
  }

  export type MassingMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MassingMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MassingCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    createdAt: number
    updatedAt: number
    massingData: number
    analysis: number
    _all: number
  }


  export type MassingMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MassingMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MassingCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    massingData?: true
    analysis?: true
    _all?: true
  }

  export type MassingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Massing to aggregate.
     */
    where?: MassingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Massings to fetch.
     */
    orderBy?: MassingOrderByWithRelationInput | MassingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MassingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Massings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Massings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Massings
    **/
    _count?: true | MassingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MassingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MassingMaxAggregateInputType
  }

  export type GetMassingAggregateType<T extends MassingAggregateArgs> = {
        [P in keyof T & keyof AggregateMassing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMassing[P]>
      : GetScalarType<T[P], AggregateMassing[P]>
  }




  export type MassingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MassingWhereInput
    orderBy?: MassingOrderByWithAggregationInput | MassingOrderByWithAggregationInput[]
    by: MassingScalarFieldEnum[] | MassingScalarFieldEnum
    having?: MassingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MassingCountAggregateInputType | true
    _min?: MassingMinAggregateInputType
    _max?: MassingMaxAggregateInputType
  }

  export type MassingGroupByOutputType = {
    id: string
    projectId: string
    name: string
    createdAt: Date
    updatedAt: Date
    massingData: JsonValue
    analysis: JsonValue | null
    _count: MassingCountAggregateOutputType | null
    _min: MassingMinAggregateOutputType | null
    _max: MassingMaxAggregateOutputType | null
  }

  type GetMassingGroupByPayload<T extends MassingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MassingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MassingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MassingGroupByOutputType[P]>
            : GetScalarType<T[P], MassingGroupByOutputType[P]>
        }
      >
    >


  export type MassingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    massingData?: boolean
    analysis?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["massing"]>

  export type MassingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    massingData?: boolean
    analysis?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["massing"]>

  export type MassingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    massingData?: boolean
    analysis?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["massing"]>

  export type MassingSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    massingData?: boolean
    analysis?: boolean
  }

  export type MassingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "name" | "createdAt" | "updatedAt" | "massingData" | "analysis", ExtArgs["result"]["massing"]>
  export type MassingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type MassingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type MassingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $MassingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Massing"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      createdAt: Date
      updatedAt: Date
      massingData: Prisma.JsonValue
      analysis: Prisma.JsonValue | null
    }, ExtArgs["result"]["massing"]>
    composites: {}
  }

  type MassingGetPayload<S extends boolean | null | undefined | MassingDefaultArgs> = $Result.GetResult<Prisma.$MassingPayload, S>

  type MassingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MassingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MassingCountAggregateInputType | true
    }

  export interface MassingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Massing'], meta: { name: 'Massing' } }
    /**
     * Find zero or one Massing that matches the filter.
     * @param {MassingFindUniqueArgs} args - Arguments to find a Massing
     * @example
     * // Get one Massing
     * const massing = await prisma.massing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MassingFindUniqueArgs>(args: SelectSubset<T, MassingFindUniqueArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Massing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MassingFindUniqueOrThrowArgs} args - Arguments to find a Massing
     * @example
     * // Get one Massing
     * const massing = await prisma.massing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MassingFindUniqueOrThrowArgs>(args: SelectSubset<T, MassingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Massing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingFindFirstArgs} args - Arguments to find a Massing
     * @example
     * // Get one Massing
     * const massing = await prisma.massing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MassingFindFirstArgs>(args?: SelectSubset<T, MassingFindFirstArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Massing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingFindFirstOrThrowArgs} args - Arguments to find a Massing
     * @example
     * // Get one Massing
     * const massing = await prisma.massing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MassingFindFirstOrThrowArgs>(args?: SelectSubset<T, MassingFindFirstOrThrowArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Massings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Massings
     * const massings = await prisma.massing.findMany()
     * 
     * // Get first 10 Massings
     * const massings = await prisma.massing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const massingWithIdOnly = await prisma.massing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MassingFindManyArgs>(args?: SelectSubset<T, MassingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Massing.
     * @param {MassingCreateArgs} args - Arguments to create a Massing.
     * @example
     * // Create one Massing
     * const Massing = await prisma.massing.create({
     *   data: {
     *     // ... data to create a Massing
     *   }
     * })
     * 
     */
    create<T extends MassingCreateArgs>(args: SelectSubset<T, MassingCreateArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Massings.
     * @param {MassingCreateManyArgs} args - Arguments to create many Massings.
     * @example
     * // Create many Massings
     * const massing = await prisma.massing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MassingCreateManyArgs>(args?: SelectSubset<T, MassingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Massings and returns the data saved in the database.
     * @param {MassingCreateManyAndReturnArgs} args - Arguments to create many Massings.
     * @example
     * // Create many Massings
     * const massing = await prisma.massing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Massings and only return the `id`
     * const massingWithIdOnly = await prisma.massing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MassingCreateManyAndReturnArgs>(args?: SelectSubset<T, MassingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Massing.
     * @param {MassingDeleteArgs} args - Arguments to delete one Massing.
     * @example
     * // Delete one Massing
     * const Massing = await prisma.massing.delete({
     *   where: {
     *     // ... filter to delete one Massing
     *   }
     * })
     * 
     */
    delete<T extends MassingDeleteArgs>(args: SelectSubset<T, MassingDeleteArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Massing.
     * @param {MassingUpdateArgs} args - Arguments to update one Massing.
     * @example
     * // Update one Massing
     * const massing = await prisma.massing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MassingUpdateArgs>(args: SelectSubset<T, MassingUpdateArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Massings.
     * @param {MassingDeleteManyArgs} args - Arguments to filter Massings to delete.
     * @example
     * // Delete a few Massings
     * const { count } = await prisma.massing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MassingDeleteManyArgs>(args?: SelectSubset<T, MassingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Massings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Massings
     * const massing = await prisma.massing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MassingUpdateManyArgs>(args: SelectSubset<T, MassingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Massings and returns the data updated in the database.
     * @param {MassingUpdateManyAndReturnArgs} args - Arguments to update many Massings.
     * @example
     * // Update many Massings
     * const massing = await prisma.massing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Massings and only return the `id`
     * const massingWithIdOnly = await prisma.massing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MassingUpdateManyAndReturnArgs>(args: SelectSubset<T, MassingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Massing.
     * @param {MassingUpsertArgs} args - Arguments to update or create a Massing.
     * @example
     * // Update or create a Massing
     * const massing = await prisma.massing.upsert({
     *   create: {
     *     // ... data to create a Massing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Massing we want to update
     *   }
     * })
     */
    upsert<T extends MassingUpsertArgs>(args: SelectSubset<T, MassingUpsertArgs<ExtArgs>>): Prisma__MassingClient<$Result.GetResult<Prisma.$MassingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Massings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingCountArgs} args - Arguments to filter Massings to count.
     * @example
     * // Count the number of Massings
     * const count = await prisma.massing.count({
     *   where: {
     *     // ... the filter for the Massings we want to count
     *   }
     * })
    **/
    count<T extends MassingCountArgs>(
      args?: Subset<T, MassingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MassingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Massing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MassingAggregateArgs>(args: Subset<T, MassingAggregateArgs>): Prisma.PrismaPromise<GetMassingAggregateType<T>>

    /**
     * Group by Massing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MassingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MassingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MassingGroupByArgs['orderBy'] }
        : { orderBy?: MassingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MassingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMassingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Massing model
   */
  readonly fields: MassingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Massing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MassingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Massing model
   */
  interface MassingFieldRefs {
    readonly id: FieldRef<"Massing", 'String'>
    readonly projectId: FieldRef<"Massing", 'String'>
    readonly name: FieldRef<"Massing", 'String'>
    readonly createdAt: FieldRef<"Massing", 'DateTime'>
    readonly updatedAt: FieldRef<"Massing", 'DateTime'>
    readonly massingData: FieldRef<"Massing", 'Json'>
    readonly analysis: FieldRef<"Massing", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Massing findUnique
   */
  export type MassingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * Filter, which Massing to fetch.
     */
    where: MassingWhereUniqueInput
  }

  /**
   * Massing findUniqueOrThrow
   */
  export type MassingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * Filter, which Massing to fetch.
     */
    where: MassingWhereUniqueInput
  }

  /**
   * Massing findFirst
   */
  export type MassingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * Filter, which Massing to fetch.
     */
    where?: MassingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Massings to fetch.
     */
    orderBy?: MassingOrderByWithRelationInput | MassingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Massings.
     */
    cursor?: MassingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Massings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Massings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Massings.
     */
    distinct?: MassingScalarFieldEnum | MassingScalarFieldEnum[]
  }

  /**
   * Massing findFirstOrThrow
   */
  export type MassingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * Filter, which Massing to fetch.
     */
    where?: MassingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Massings to fetch.
     */
    orderBy?: MassingOrderByWithRelationInput | MassingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Massings.
     */
    cursor?: MassingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Massings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Massings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Massings.
     */
    distinct?: MassingScalarFieldEnum | MassingScalarFieldEnum[]
  }

  /**
   * Massing findMany
   */
  export type MassingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * Filter, which Massings to fetch.
     */
    where?: MassingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Massings to fetch.
     */
    orderBy?: MassingOrderByWithRelationInput | MassingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Massings.
     */
    cursor?: MassingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Massings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Massings.
     */
    skip?: number
    distinct?: MassingScalarFieldEnum | MassingScalarFieldEnum[]
  }

  /**
   * Massing create
   */
  export type MassingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * The data needed to create a Massing.
     */
    data: XOR<MassingCreateInput, MassingUncheckedCreateInput>
  }

  /**
   * Massing createMany
   */
  export type MassingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Massings.
     */
    data: MassingCreateManyInput | MassingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Massing createManyAndReturn
   */
  export type MassingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * The data used to create many Massings.
     */
    data: MassingCreateManyInput | MassingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Massing update
   */
  export type MassingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * The data needed to update a Massing.
     */
    data: XOR<MassingUpdateInput, MassingUncheckedUpdateInput>
    /**
     * Choose, which Massing to update.
     */
    where: MassingWhereUniqueInput
  }

  /**
   * Massing updateMany
   */
  export type MassingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Massings.
     */
    data: XOR<MassingUpdateManyMutationInput, MassingUncheckedUpdateManyInput>
    /**
     * Filter which Massings to update
     */
    where?: MassingWhereInput
    /**
     * Limit how many Massings to update.
     */
    limit?: number
  }

  /**
   * Massing updateManyAndReturn
   */
  export type MassingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * The data used to update Massings.
     */
    data: XOR<MassingUpdateManyMutationInput, MassingUncheckedUpdateManyInput>
    /**
     * Filter which Massings to update
     */
    where?: MassingWhereInput
    /**
     * Limit how many Massings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Massing upsert
   */
  export type MassingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * The filter to search for the Massing to update in case it exists.
     */
    where: MassingWhereUniqueInput
    /**
     * In case the Massing found by the `where` argument doesn't exist, create a new Massing with this data.
     */
    create: XOR<MassingCreateInput, MassingUncheckedCreateInput>
    /**
     * In case the Massing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MassingUpdateInput, MassingUncheckedUpdateInput>
  }

  /**
   * Massing delete
   */
  export type MassingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
    /**
     * Filter which Massing to delete.
     */
    where: MassingWhereUniqueInput
  }

  /**
   * Massing deleteMany
   */
  export type MassingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Massings to delete
     */
    where?: MassingWhereInput
    /**
     * Limit how many Massings to delete.
     */
    limit?: number
  }

  /**
   * Massing without action
   */
  export type MassingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Massing
     */
    select?: MassingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Massing
     */
    omit?: MassingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MassingInclude<ExtArgs> | null
  }


  /**
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    size: number | null
  }

  export type FileSumAggregateOutputType = {
    size: number | null
  }

  export type FileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    projectId: string | null
    filename: string | null
    originalName: string | null
    mimeType: string | null
    size: number | null
    storageUrl: string | null
    storagePath: string | null
    path: string | null
    fileType: string | null
    category: string | null
    uploadedBy: string | null
    createdAt: Date | null
  }

  export type FileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    projectId: string | null
    filename: string | null
    originalName: string | null
    mimeType: string | null
    size: number | null
    storageUrl: string | null
    storagePath: string | null
    path: string | null
    fileType: string | null
    category: string | null
    uploadedBy: string | null
    createdAt: Date | null
  }

  export type FileCountAggregateOutputType = {
    id: number
    userId: number
    projectId: number
    filename: number
    originalName: number
    mimeType: number
    size: number
    storageUrl: number
    storagePath: number
    path: number
    fileType: number
    category: number
    uploadedBy: number
    createdAt: number
    metadata: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    size?: true
  }

  export type FileSumAggregateInputType = {
    size?: true
  }

  export type FileMinAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    filename?: true
    originalName?: true
    mimeType?: true
    size?: true
    storageUrl?: true
    storagePath?: true
    path?: true
    fileType?: true
    category?: true
    uploadedBy?: true
    createdAt?: true
  }

  export type FileMaxAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    filename?: true
    originalName?: true
    mimeType?: true
    size?: true
    storageUrl?: true
    storagePath?: true
    path?: true
    fileType?: true
    category?: true
    uploadedBy?: true
    createdAt?: true
  }

  export type FileCountAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    filename?: true
    originalName?: true
    mimeType?: true
    size?: true
    storageUrl?: true
    storagePath?: true
    path?: true
    fileType?: true
    category?: true
    uploadedBy?: true
    createdAt?: true
    metadata?: true
    _all?: true
  }

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[]
    by: FileScalarFieldEnum[] | FileScalarFieldEnum
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }

  export type FileGroupByOutputType = {
    id: string
    userId: string
    projectId: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    storageUrl: string
    storagePath: string
    path: string | null
    fileType: string
    category: string | null
    uploadedBy: string | null
    createdAt: Date
    metadata: JsonValue | null
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    storageUrl?: boolean
    storagePath?: boolean
    path?: boolean
    fileType?: boolean
    category?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["file"]>

  export type FileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    storageUrl?: boolean
    storagePath?: boolean
    path?: boolean
    fileType?: boolean
    category?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["file"]>

  export type FileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    storageUrl?: boolean
    storagePath?: boolean
    path?: boolean
    fileType?: boolean
    category?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["file"]>

  export type FileSelectScalar = {
    id?: boolean
    userId?: boolean
    projectId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    storageUrl?: boolean
    storagePath?: boolean
    path?: boolean
    fileType?: boolean
    category?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    metadata?: boolean
  }

  export type FileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "projectId" | "filename" | "originalName" | "mimeType" | "size" | "storageUrl" | "storagePath" | "path" | "fileType" | "category" | "uploadedBy" | "createdAt" | "metadata", ExtArgs["result"]["file"]>

  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "File"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      projectId: string | null
      filename: string
      originalName: string
      mimeType: string
      size: number
      storageUrl: string
      storagePath: string
      path: string | null
      fileType: string
      category: string | null
      uploadedBy: string | null
      createdAt: Date
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["file"]>
    composites: {}
  }

  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<Prisma.$FilePayload, S>

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File'], meta: { name: 'File' } }
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileFindUniqueArgs>(args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one File that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs>(args: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileFindFirstArgs>(args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs>(args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileWithIdOnly = await prisma.file.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileFindManyArgs>(args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
     */
    create<T extends FileCreateArgs>(args: SelectSubset<T, FileCreateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Files.
     * @param {FileCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileCreateManyArgs>(args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Files and returns the data saved in the database.
     * @param {FileCreateManyAndReturnArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileCreateManyAndReturnArgs>(args?: SelectSubset<T, FileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
     */
    delete<T extends FileDeleteArgs>(args: SelectSubset<T, FileDeleteArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileUpdateArgs>(args: SelectSubset<T, FileUpdateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileDeleteManyArgs>(args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileUpdateManyArgs>(args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files and returns the data updated in the database.
     * @param {FileUpdateManyAndReturnArgs} args - Arguments to update many Files.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FileUpdateManyAndReturnArgs>(args: SelectSubset<T, FileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
     */
    upsert<T extends FileUpsertArgs>(args: SelectSubset<T, FileUpsertArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the File model
   */
  readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the File model
   */
  interface FileFieldRefs {
    readonly id: FieldRef<"File", 'String'>
    readonly userId: FieldRef<"File", 'String'>
    readonly projectId: FieldRef<"File", 'String'>
    readonly filename: FieldRef<"File", 'String'>
    readonly originalName: FieldRef<"File", 'String'>
    readonly mimeType: FieldRef<"File", 'String'>
    readonly size: FieldRef<"File", 'Int'>
    readonly storageUrl: FieldRef<"File", 'String'>
    readonly storagePath: FieldRef<"File", 'String'>
    readonly path: FieldRef<"File", 'String'>
    readonly fileType: FieldRef<"File", 'String'>
    readonly category: FieldRef<"File", 'String'>
    readonly uploadedBy: FieldRef<"File", 'String'>
    readonly createdAt: FieldRef<"File", 'DateTime'>
    readonly metadata: FieldRef<"File", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }

  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * File createManyAndReturn
   */
  export type FileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
  }

  /**
   * File updateManyAndReturn
   */
  export type FileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
  }

  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }

  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to delete.
     */
    limit?: number
  }

  /**
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
  }


  /**
   * Model GeospatialCache
   */

  export type AggregateGeospatialCache = {
    _count: GeospatialCacheCountAggregateOutputType | null
    _min: GeospatialCacheMinAggregateOutputType | null
    _max: GeospatialCacheMaxAggregateOutputType | null
  }

  export type GeospatialCacheMinAggregateOutputType = {
    id: string | null
    cacheKey: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type GeospatialCacheMaxAggregateOutputType = {
    id: string | null
    cacheKey: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type GeospatialCacheCountAggregateOutputType = {
    id: number
    cacheKey: number
    data: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type GeospatialCacheMinAggregateInputType = {
    id?: true
    cacheKey?: true
    expiresAt?: true
    createdAt?: true
  }

  export type GeospatialCacheMaxAggregateInputType = {
    id?: true
    cacheKey?: true
    expiresAt?: true
    createdAt?: true
  }

  export type GeospatialCacheCountAggregateInputType = {
    id?: true
    cacheKey?: true
    data?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type GeospatialCacheAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeospatialCache to aggregate.
     */
    where?: GeospatialCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeospatialCaches to fetch.
     */
    orderBy?: GeospatialCacheOrderByWithRelationInput | GeospatialCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GeospatialCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeospatialCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeospatialCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GeospatialCaches
    **/
    _count?: true | GeospatialCacheCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GeospatialCacheMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GeospatialCacheMaxAggregateInputType
  }

  export type GetGeospatialCacheAggregateType<T extends GeospatialCacheAggregateArgs> = {
        [P in keyof T & keyof AggregateGeospatialCache]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGeospatialCache[P]>
      : GetScalarType<T[P], AggregateGeospatialCache[P]>
  }




  export type GeospatialCacheGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeospatialCacheWhereInput
    orderBy?: GeospatialCacheOrderByWithAggregationInput | GeospatialCacheOrderByWithAggregationInput[]
    by: GeospatialCacheScalarFieldEnum[] | GeospatialCacheScalarFieldEnum
    having?: GeospatialCacheScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GeospatialCacheCountAggregateInputType | true
    _min?: GeospatialCacheMinAggregateInputType
    _max?: GeospatialCacheMaxAggregateInputType
  }

  export type GeospatialCacheGroupByOutputType = {
    id: string
    cacheKey: string
    data: JsonValue
    expiresAt: Date
    createdAt: Date
    _count: GeospatialCacheCountAggregateOutputType | null
    _min: GeospatialCacheMinAggregateOutputType | null
    _max: GeospatialCacheMaxAggregateOutputType | null
  }

  type GetGeospatialCacheGroupByPayload<T extends GeospatialCacheGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GeospatialCacheGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GeospatialCacheGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GeospatialCacheGroupByOutputType[P]>
            : GetScalarType<T[P], GeospatialCacheGroupByOutputType[P]>
        }
      >
    >


  export type GeospatialCacheSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cacheKey?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["geospatialCache"]>

  export type GeospatialCacheSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cacheKey?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["geospatialCache"]>

  export type GeospatialCacheSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cacheKey?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["geospatialCache"]>

  export type GeospatialCacheSelectScalar = {
    id?: boolean
    cacheKey?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type GeospatialCacheOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cacheKey" | "data" | "expiresAt" | "createdAt", ExtArgs["result"]["geospatialCache"]>

  export type $GeospatialCachePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GeospatialCache"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cacheKey: string
      data: Prisma.JsonValue
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["geospatialCache"]>
    composites: {}
  }

  type GeospatialCacheGetPayload<S extends boolean | null | undefined | GeospatialCacheDefaultArgs> = $Result.GetResult<Prisma.$GeospatialCachePayload, S>

  type GeospatialCacheCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GeospatialCacheFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GeospatialCacheCountAggregateInputType | true
    }

  export interface GeospatialCacheDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GeospatialCache'], meta: { name: 'GeospatialCache' } }
    /**
     * Find zero or one GeospatialCache that matches the filter.
     * @param {GeospatialCacheFindUniqueArgs} args - Arguments to find a GeospatialCache
     * @example
     * // Get one GeospatialCache
     * const geospatialCache = await prisma.geospatialCache.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GeospatialCacheFindUniqueArgs>(args: SelectSubset<T, GeospatialCacheFindUniqueArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GeospatialCache that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GeospatialCacheFindUniqueOrThrowArgs} args - Arguments to find a GeospatialCache
     * @example
     * // Get one GeospatialCache
     * const geospatialCache = await prisma.geospatialCache.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GeospatialCacheFindUniqueOrThrowArgs>(args: SelectSubset<T, GeospatialCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GeospatialCache that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheFindFirstArgs} args - Arguments to find a GeospatialCache
     * @example
     * // Get one GeospatialCache
     * const geospatialCache = await prisma.geospatialCache.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GeospatialCacheFindFirstArgs>(args?: SelectSubset<T, GeospatialCacheFindFirstArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GeospatialCache that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheFindFirstOrThrowArgs} args - Arguments to find a GeospatialCache
     * @example
     * // Get one GeospatialCache
     * const geospatialCache = await prisma.geospatialCache.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GeospatialCacheFindFirstOrThrowArgs>(args?: SelectSubset<T, GeospatialCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GeospatialCaches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GeospatialCaches
     * const geospatialCaches = await prisma.geospatialCache.findMany()
     * 
     * // Get first 10 GeospatialCaches
     * const geospatialCaches = await prisma.geospatialCache.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const geospatialCacheWithIdOnly = await prisma.geospatialCache.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GeospatialCacheFindManyArgs>(args?: SelectSubset<T, GeospatialCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GeospatialCache.
     * @param {GeospatialCacheCreateArgs} args - Arguments to create a GeospatialCache.
     * @example
     * // Create one GeospatialCache
     * const GeospatialCache = await prisma.geospatialCache.create({
     *   data: {
     *     // ... data to create a GeospatialCache
     *   }
     * })
     * 
     */
    create<T extends GeospatialCacheCreateArgs>(args: SelectSubset<T, GeospatialCacheCreateArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GeospatialCaches.
     * @param {GeospatialCacheCreateManyArgs} args - Arguments to create many GeospatialCaches.
     * @example
     * // Create many GeospatialCaches
     * const geospatialCache = await prisma.geospatialCache.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GeospatialCacheCreateManyArgs>(args?: SelectSubset<T, GeospatialCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GeospatialCaches and returns the data saved in the database.
     * @param {GeospatialCacheCreateManyAndReturnArgs} args - Arguments to create many GeospatialCaches.
     * @example
     * // Create many GeospatialCaches
     * const geospatialCache = await prisma.geospatialCache.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GeospatialCaches and only return the `id`
     * const geospatialCacheWithIdOnly = await prisma.geospatialCache.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GeospatialCacheCreateManyAndReturnArgs>(args?: SelectSubset<T, GeospatialCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GeospatialCache.
     * @param {GeospatialCacheDeleteArgs} args - Arguments to delete one GeospatialCache.
     * @example
     * // Delete one GeospatialCache
     * const GeospatialCache = await prisma.geospatialCache.delete({
     *   where: {
     *     // ... filter to delete one GeospatialCache
     *   }
     * })
     * 
     */
    delete<T extends GeospatialCacheDeleteArgs>(args: SelectSubset<T, GeospatialCacheDeleteArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GeospatialCache.
     * @param {GeospatialCacheUpdateArgs} args - Arguments to update one GeospatialCache.
     * @example
     * // Update one GeospatialCache
     * const geospatialCache = await prisma.geospatialCache.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GeospatialCacheUpdateArgs>(args: SelectSubset<T, GeospatialCacheUpdateArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GeospatialCaches.
     * @param {GeospatialCacheDeleteManyArgs} args - Arguments to filter GeospatialCaches to delete.
     * @example
     * // Delete a few GeospatialCaches
     * const { count } = await prisma.geospatialCache.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GeospatialCacheDeleteManyArgs>(args?: SelectSubset<T, GeospatialCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GeospatialCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GeospatialCaches
     * const geospatialCache = await prisma.geospatialCache.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GeospatialCacheUpdateManyArgs>(args: SelectSubset<T, GeospatialCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GeospatialCaches and returns the data updated in the database.
     * @param {GeospatialCacheUpdateManyAndReturnArgs} args - Arguments to update many GeospatialCaches.
     * @example
     * // Update many GeospatialCaches
     * const geospatialCache = await prisma.geospatialCache.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GeospatialCaches and only return the `id`
     * const geospatialCacheWithIdOnly = await prisma.geospatialCache.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GeospatialCacheUpdateManyAndReturnArgs>(args: SelectSubset<T, GeospatialCacheUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GeospatialCache.
     * @param {GeospatialCacheUpsertArgs} args - Arguments to update or create a GeospatialCache.
     * @example
     * // Update or create a GeospatialCache
     * const geospatialCache = await prisma.geospatialCache.upsert({
     *   create: {
     *     // ... data to create a GeospatialCache
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GeospatialCache we want to update
     *   }
     * })
     */
    upsert<T extends GeospatialCacheUpsertArgs>(args: SelectSubset<T, GeospatialCacheUpsertArgs<ExtArgs>>): Prisma__GeospatialCacheClient<$Result.GetResult<Prisma.$GeospatialCachePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GeospatialCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheCountArgs} args - Arguments to filter GeospatialCaches to count.
     * @example
     * // Count the number of GeospatialCaches
     * const count = await prisma.geospatialCache.count({
     *   where: {
     *     // ... the filter for the GeospatialCaches we want to count
     *   }
     * })
    **/
    count<T extends GeospatialCacheCountArgs>(
      args?: Subset<T, GeospatialCacheCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GeospatialCacheCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GeospatialCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GeospatialCacheAggregateArgs>(args: Subset<T, GeospatialCacheAggregateArgs>): Prisma.PrismaPromise<GetGeospatialCacheAggregateType<T>>

    /**
     * Group by GeospatialCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeospatialCacheGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GeospatialCacheGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GeospatialCacheGroupByArgs['orderBy'] }
        : { orderBy?: GeospatialCacheGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GeospatialCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGeospatialCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GeospatialCache model
   */
  readonly fields: GeospatialCacheFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GeospatialCache.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GeospatialCacheClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GeospatialCache model
   */
  interface GeospatialCacheFieldRefs {
    readonly id: FieldRef<"GeospatialCache", 'String'>
    readonly cacheKey: FieldRef<"GeospatialCache", 'String'>
    readonly data: FieldRef<"GeospatialCache", 'Json'>
    readonly expiresAt: FieldRef<"GeospatialCache", 'DateTime'>
    readonly createdAt: FieldRef<"GeospatialCache", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GeospatialCache findUnique
   */
  export type GeospatialCacheFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * Filter, which GeospatialCache to fetch.
     */
    where: GeospatialCacheWhereUniqueInput
  }

  /**
   * GeospatialCache findUniqueOrThrow
   */
  export type GeospatialCacheFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * Filter, which GeospatialCache to fetch.
     */
    where: GeospatialCacheWhereUniqueInput
  }

  /**
   * GeospatialCache findFirst
   */
  export type GeospatialCacheFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * Filter, which GeospatialCache to fetch.
     */
    where?: GeospatialCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeospatialCaches to fetch.
     */
    orderBy?: GeospatialCacheOrderByWithRelationInput | GeospatialCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeospatialCaches.
     */
    cursor?: GeospatialCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeospatialCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeospatialCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeospatialCaches.
     */
    distinct?: GeospatialCacheScalarFieldEnum | GeospatialCacheScalarFieldEnum[]
  }

  /**
   * GeospatialCache findFirstOrThrow
   */
  export type GeospatialCacheFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * Filter, which GeospatialCache to fetch.
     */
    where?: GeospatialCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeospatialCaches to fetch.
     */
    orderBy?: GeospatialCacheOrderByWithRelationInput | GeospatialCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeospatialCaches.
     */
    cursor?: GeospatialCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeospatialCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeospatialCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeospatialCaches.
     */
    distinct?: GeospatialCacheScalarFieldEnum | GeospatialCacheScalarFieldEnum[]
  }

  /**
   * GeospatialCache findMany
   */
  export type GeospatialCacheFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * Filter, which GeospatialCaches to fetch.
     */
    where?: GeospatialCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeospatialCaches to fetch.
     */
    orderBy?: GeospatialCacheOrderByWithRelationInput | GeospatialCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GeospatialCaches.
     */
    cursor?: GeospatialCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeospatialCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeospatialCaches.
     */
    skip?: number
    distinct?: GeospatialCacheScalarFieldEnum | GeospatialCacheScalarFieldEnum[]
  }

  /**
   * GeospatialCache create
   */
  export type GeospatialCacheCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * The data needed to create a GeospatialCache.
     */
    data: XOR<GeospatialCacheCreateInput, GeospatialCacheUncheckedCreateInput>
  }

  /**
   * GeospatialCache createMany
   */
  export type GeospatialCacheCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GeospatialCaches.
     */
    data: GeospatialCacheCreateManyInput | GeospatialCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GeospatialCache createManyAndReturn
   */
  export type GeospatialCacheCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * The data used to create many GeospatialCaches.
     */
    data: GeospatialCacheCreateManyInput | GeospatialCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GeospatialCache update
   */
  export type GeospatialCacheUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * The data needed to update a GeospatialCache.
     */
    data: XOR<GeospatialCacheUpdateInput, GeospatialCacheUncheckedUpdateInput>
    /**
     * Choose, which GeospatialCache to update.
     */
    where: GeospatialCacheWhereUniqueInput
  }

  /**
   * GeospatialCache updateMany
   */
  export type GeospatialCacheUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GeospatialCaches.
     */
    data: XOR<GeospatialCacheUpdateManyMutationInput, GeospatialCacheUncheckedUpdateManyInput>
    /**
     * Filter which GeospatialCaches to update
     */
    where?: GeospatialCacheWhereInput
    /**
     * Limit how many GeospatialCaches to update.
     */
    limit?: number
  }

  /**
   * GeospatialCache updateManyAndReturn
   */
  export type GeospatialCacheUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * The data used to update GeospatialCaches.
     */
    data: XOR<GeospatialCacheUpdateManyMutationInput, GeospatialCacheUncheckedUpdateManyInput>
    /**
     * Filter which GeospatialCaches to update
     */
    where?: GeospatialCacheWhereInput
    /**
     * Limit how many GeospatialCaches to update.
     */
    limit?: number
  }

  /**
   * GeospatialCache upsert
   */
  export type GeospatialCacheUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * The filter to search for the GeospatialCache to update in case it exists.
     */
    where: GeospatialCacheWhereUniqueInput
    /**
     * In case the GeospatialCache found by the `where` argument doesn't exist, create a new GeospatialCache with this data.
     */
    create: XOR<GeospatialCacheCreateInput, GeospatialCacheUncheckedCreateInput>
    /**
     * In case the GeospatialCache was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GeospatialCacheUpdateInput, GeospatialCacheUncheckedUpdateInput>
  }

  /**
   * GeospatialCache delete
   */
  export type GeospatialCacheDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
    /**
     * Filter which GeospatialCache to delete.
     */
    where: GeospatialCacheWhereUniqueInput
  }

  /**
   * GeospatialCache deleteMany
   */
  export type GeospatialCacheDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeospatialCaches to delete
     */
    where?: GeospatialCacheWhereInput
    /**
     * Limit how many GeospatialCaches to delete.
     */
    limit?: number
  }

  /**
   * GeospatialCache without action
   */
  export type GeospatialCacheDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeospatialCache
     */
    select?: GeospatialCacheSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeospatialCache
     */
    omit?: GeospatialCacheOmit<ExtArgs> | null
  }


  /**
   * Model SketchfabToken
   */

  export type AggregateSketchfabToken = {
    _count: SketchfabTokenCountAggregateOutputType | null
    _min: SketchfabTokenMinAggregateOutputType | null
    _max: SketchfabTokenMaxAggregateOutputType | null
  }

  export type SketchfabTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SketchfabTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SketchfabTokenCountAggregateOutputType = {
    id: number
    userId: number
    accessToken: number
    refreshToken: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SketchfabTokenMinAggregateInputType = {
    id?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SketchfabTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SketchfabTokenCountAggregateInputType = {
    id?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SketchfabTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SketchfabToken to aggregate.
     */
    where?: SketchfabTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabTokens to fetch.
     */
    orderBy?: SketchfabTokenOrderByWithRelationInput | SketchfabTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SketchfabTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SketchfabTokens
    **/
    _count?: true | SketchfabTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SketchfabTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SketchfabTokenMaxAggregateInputType
  }

  export type GetSketchfabTokenAggregateType<T extends SketchfabTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateSketchfabToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSketchfabToken[P]>
      : GetScalarType<T[P], AggregateSketchfabToken[P]>
  }




  export type SketchfabTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SketchfabTokenWhereInput
    orderBy?: SketchfabTokenOrderByWithAggregationInput | SketchfabTokenOrderByWithAggregationInput[]
    by: SketchfabTokenScalarFieldEnum[] | SketchfabTokenScalarFieldEnum
    having?: SketchfabTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SketchfabTokenCountAggregateInputType | true
    _min?: SketchfabTokenMinAggregateInputType
    _max?: SketchfabTokenMaxAggregateInputType
  }

  export type SketchfabTokenGroupByOutputType = {
    id: string
    userId: string
    accessToken: string
    refreshToken: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: SketchfabTokenCountAggregateOutputType | null
    _min: SketchfabTokenMinAggregateOutputType | null
    _max: SketchfabTokenMaxAggregateOutputType | null
  }

  type GetSketchfabTokenGroupByPayload<T extends SketchfabTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SketchfabTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SketchfabTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SketchfabTokenGroupByOutputType[P]>
            : GetScalarType<T[P], SketchfabTokenGroupByOutputType[P]>
        }
      >
    >


  export type SketchfabTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sketchfabToken"]>

  export type SketchfabTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sketchfabToken"]>

  export type SketchfabTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sketchfabToken"]>

  export type SketchfabTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SketchfabTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "accessToken" | "refreshToken" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["sketchfabToken"]>
  export type SketchfabTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SketchfabTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SketchfabTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SketchfabTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SketchfabToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      accessToken: string
      refreshToken: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sketchfabToken"]>
    composites: {}
  }

  type SketchfabTokenGetPayload<S extends boolean | null | undefined | SketchfabTokenDefaultArgs> = $Result.GetResult<Prisma.$SketchfabTokenPayload, S>

  type SketchfabTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SketchfabTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SketchfabTokenCountAggregateInputType | true
    }

  export interface SketchfabTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SketchfabToken'], meta: { name: 'SketchfabToken' } }
    /**
     * Find zero or one SketchfabToken that matches the filter.
     * @param {SketchfabTokenFindUniqueArgs} args - Arguments to find a SketchfabToken
     * @example
     * // Get one SketchfabToken
     * const sketchfabToken = await prisma.sketchfabToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SketchfabTokenFindUniqueArgs>(args: SelectSubset<T, SketchfabTokenFindUniqueArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SketchfabToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SketchfabTokenFindUniqueOrThrowArgs} args - Arguments to find a SketchfabToken
     * @example
     * // Get one SketchfabToken
     * const sketchfabToken = await prisma.sketchfabToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SketchfabTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, SketchfabTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SketchfabToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenFindFirstArgs} args - Arguments to find a SketchfabToken
     * @example
     * // Get one SketchfabToken
     * const sketchfabToken = await prisma.sketchfabToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SketchfabTokenFindFirstArgs>(args?: SelectSubset<T, SketchfabTokenFindFirstArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SketchfabToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenFindFirstOrThrowArgs} args - Arguments to find a SketchfabToken
     * @example
     * // Get one SketchfabToken
     * const sketchfabToken = await prisma.sketchfabToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SketchfabTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, SketchfabTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SketchfabTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SketchfabTokens
     * const sketchfabTokens = await prisma.sketchfabToken.findMany()
     * 
     * // Get first 10 SketchfabTokens
     * const sketchfabTokens = await prisma.sketchfabToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sketchfabTokenWithIdOnly = await prisma.sketchfabToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SketchfabTokenFindManyArgs>(args?: SelectSubset<T, SketchfabTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SketchfabToken.
     * @param {SketchfabTokenCreateArgs} args - Arguments to create a SketchfabToken.
     * @example
     * // Create one SketchfabToken
     * const SketchfabToken = await prisma.sketchfabToken.create({
     *   data: {
     *     // ... data to create a SketchfabToken
     *   }
     * })
     * 
     */
    create<T extends SketchfabTokenCreateArgs>(args: SelectSubset<T, SketchfabTokenCreateArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SketchfabTokens.
     * @param {SketchfabTokenCreateManyArgs} args - Arguments to create many SketchfabTokens.
     * @example
     * // Create many SketchfabTokens
     * const sketchfabToken = await prisma.sketchfabToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SketchfabTokenCreateManyArgs>(args?: SelectSubset<T, SketchfabTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SketchfabTokens and returns the data saved in the database.
     * @param {SketchfabTokenCreateManyAndReturnArgs} args - Arguments to create many SketchfabTokens.
     * @example
     * // Create many SketchfabTokens
     * const sketchfabToken = await prisma.sketchfabToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SketchfabTokens and only return the `id`
     * const sketchfabTokenWithIdOnly = await prisma.sketchfabToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SketchfabTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, SketchfabTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SketchfabToken.
     * @param {SketchfabTokenDeleteArgs} args - Arguments to delete one SketchfabToken.
     * @example
     * // Delete one SketchfabToken
     * const SketchfabToken = await prisma.sketchfabToken.delete({
     *   where: {
     *     // ... filter to delete one SketchfabToken
     *   }
     * })
     * 
     */
    delete<T extends SketchfabTokenDeleteArgs>(args: SelectSubset<T, SketchfabTokenDeleteArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SketchfabToken.
     * @param {SketchfabTokenUpdateArgs} args - Arguments to update one SketchfabToken.
     * @example
     * // Update one SketchfabToken
     * const sketchfabToken = await prisma.sketchfabToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SketchfabTokenUpdateArgs>(args: SelectSubset<T, SketchfabTokenUpdateArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SketchfabTokens.
     * @param {SketchfabTokenDeleteManyArgs} args - Arguments to filter SketchfabTokens to delete.
     * @example
     * // Delete a few SketchfabTokens
     * const { count } = await prisma.sketchfabToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SketchfabTokenDeleteManyArgs>(args?: SelectSubset<T, SketchfabTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SketchfabTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SketchfabTokens
     * const sketchfabToken = await prisma.sketchfabToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SketchfabTokenUpdateManyArgs>(args: SelectSubset<T, SketchfabTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SketchfabTokens and returns the data updated in the database.
     * @param {SketchfabTokenUpdateManyAndReturnArgs} args - Arguments to update many SketchfabTokens.
     * @example
     * // Update many SketchfabTokens
     * const sketchfabToken = await prisma.sketchfabToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SketchfabTokens and only return the `id`
     * const sketchfabTokenWithIdOnly = await prisma.sketchfabToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SketchfabTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, SketchfabTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SketchfabToken.
     * @param {SketchfabTokenUpsertArgs} args - Arguments to update or create a SketchfabToken.
     * @example
     * // Update or create a SketchfabToken
     * const sketchfabToken = await prisma.sketchfabToken.upsert({
     *   create: {
     *     // ... data to create a SketchfabToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SketchfabToken we want to update
     *   }
     * })
     */
    upsert<T extends SketchfabTokenUpsertArgs>(args: SelectSubset<T, SketchfabTokenUpsertArgs<ExtArgs>>): Prisma__SketchfabTokenClient<$Result.GetResult<Prisma.$SketchfabTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SketchfabTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenCountArgs} args - Arguments to filter SketchfabTokens to count.
     * @example
     * // Count the number of SketchfabTokens
     * const count = await prisma.sketchfabToken.count({
     *   where: {
     *     // ... the filter for the SketchfabTokens we want to count
     *   }
     * })
    **/
    count<T extends SketchfabTokenCountArgs>(
      args?: Subset<T, SketchfabTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SketchfabTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SketchfabToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SketchfabTokenAggregateArgs>(args: Subset<T, SketchfabTokenAggregateArgs>): Prisma.PrismaPromise<GetSketchfabTokenAggregateType<T>>

    /**
     * Group by SketchfabToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SketchfabTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SketchfabTokenGroupByArgs['orderBy'] }
        : { orderBy?: SketchfabTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SketchfabTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSketchfabTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SketchfabToken model
   */
  readonly fields: SketchfabTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SketchfabToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SketchfabTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SketchfabToken model
   */
  interface SketchfabTokenFieldRefs {
    readonly id: FieldRef<"SketchfabToken", 'String'>
    readonly userId: FieldRef<"SketchfabToken", 'String'>
    readonly accessToken: FieldRef<"SketchfabToken", 'String'>
    readonly refreshToken: FieldRef<"SketchfabToken", 'String'>
    readonly expiresAt: FieldRef<"SketchfabToken", 'DateTime'>
    readonly createdAt: FieldRef<"SketchfabToken", 'DateTime'>
    readonly updatedAt: FieldRef<"SketchfabToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SketchfabToken findUnique
   */
  export type SketchfabTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabToken to fetch.
     */
    where: SketchfabTokenWhereUniqueInput
  }

  /**
   * SketchfabToken findUniqueOrThrow
   */
  export type SketchfabTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabToken to fetch.
     */
    where: SketchfabTokenWhereUniqueInput
  }

  /**
   * SketchfabToken findFirst
   */
  export type SketchfabTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabToken to fetch.
     */
    where?: SketchfabTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabTokens to fetch.
     */
    orderBy?: SketchfabTokenOrderByWithRelationInput | SketchfabTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SketchfabTokens.
     */
    cursor?: SketchfabTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SketchfabTokens.
     */
    distinct?: SketchfabTokenScalarFieldEnum | SketchfabTokenScalarFieldEnum[]
  }

  /**
   * SketchfabToken findFirstOrThrow
   */
  export type SketchfabTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabToken to fetch.
     */
    where?: SketchfabTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabTokens to fetch.
     */
    orderBy?: SketchfabTokenOrderByWithRelationInput | SketchfabTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SketchfabTokens.
     */
    cursor?: SketchfabTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SketchfabTokens.
     */
    distinct?: SketchfabTokenScalarFieldEnum | SketchfabTokenScalarFieldEnum[]
  }

  /**
   * SketchfabToken findMany
   */
  export type SketchfabTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabTokens to fetch.
     */
    where?: SketchfabTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabTokens to fetch.
     */
    orderBy?: SketchfabTokenOrderByWithRelationInput | SketchfabTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SketchfabTokens.
     */
    cursor?: SketchfabTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabTokens.
     */
    skip?: number
    distinct?: SketchfabTokenScalarFieldEnum | SketchfabTokenScalarFieldEnum[]
  }

  /**
   * SketchfabToken create
   */
  export type SketchfabTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a SketchfabToken.
     */
    data: XOR<SketchfabTokenCreateInput, SketchfabTokenUncheckedCreateInput>
  }

  /**
   * SketchfabToken createMany
   */
  export type SketchfabTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SketchfabTokens.
     */
    data: SketchfabTokenCreateManyInput | SketchfabTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SketchfabToken createManyAndReturn
   */
  export type SketchfabTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * The data used to create many SketchfabTokens.
     */
    data: SketchfabTokenCreateManyInput | SketchfabTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SketchfabToken update
   */
  export type SketchfabTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a SketchfabToken.
     */
    data: XOR<SketchfabTokenUpdateInput, SketchfabTokenUncheckedUpdateInput>
    /**
     * Choose, which SketchfabToken to update.
     */
    where: SketchfabTokenWhereUniqueInput
  }

  /**
   * SketchfabToken updateMany
   */
  export type SketchfabTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SketchfabTokens.
     */
    data: XOR<SketchfabTokenUpdateManyMutationInput, SketchfabTokenUncheckedUpdateManyInput>
    /**
     * Filter which SketchfabTokens to update
     */
    where?: SketchfabTokenWhereInput
    /**
     * Limit how many SketchfabTokens to update.
     */
    limit?: number
  }

  /**
   * SketchfabToken updateManyAndReturn
   */
  export type SketchfabTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * The data used to update SketchfabTokens.
     */
    data: XOR<SketchfabTokenUpdateManyMutationInput, SketchfabTokenUncheckedUpdateManyInput>
    /**
     * Filter which SketchfabTokens to update
     */
    where?: SketchfabTokenWhereInput
    /**
     * Limit how many SketchfabTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SketchfabToken upsert
   */
  export type SketchfabTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the SketchfabToken to update in case it exists.
     */
    where: SketchfabTokenWhereUniqueInput
    /**
     * In case the SketchfabToken found by the `where` argument doesn't exist, create a new SketchfabToken with this data.
     */
    create: XOR<SketchfabTokenCreateInput, SketchfabTokenUncheckedCreateInput>
    /**
     * In case the SketchfabToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SketchfabTokenUpdateInput, SketchfabTokenUncheckedUpdateInput>
  }

  /**
   * SketchfabToken delete
   */
  export type SketchfabTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
    /**
     * Filter which SketchfabToken to delete.
     */
    where: SketchfabTokenWhereUniqueInput
  }

  /**
   * SketchfabToken deleteMany
   */
  export type SketchfabTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SketchfabTokens to delete
     */
    where?: SketchfabTokenWhereInput
    /**
     * Limit how many SketchfabTokens to delete.
     */
    limit?: number
  }

  /**
   * SketchfabToken without action
   */
  export type SketchfabTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabToken
     */
    select?: SketchfabTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabToken
     */
    omit?: SketchfabTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabTokenInclude<ExtArgs> | null
  }


  /**
   * Model SketchfabModel
   */

  export type AggregateSketchfabModel = {
    _count: SketchfabModelCountAggregateOutputType | null
    _min: SketchfabModelMinAggregateOutputType | null
    _max: SketchfabModelMaxAggregateOutputType | null
  }

  export type SketchfabModelMinAggregateOutputType = {
    id: string | null
    modelUid: string | null
    userId: string | null
    projectId: string | null
    fileUrl: string | null
    license: string | null
    createdAt: Date | null
  }

  export type SketchfabModelMaxAggregateOutputType = {
    id: string | null
    modelUid: string | null
    userId: string | null
    projectId: string | null
    fileUrl: string | null
    license: string | null
    createdAt: Date | null
  }

  export type SketchfabModelCountAggregateOutputType = {
    id: number
    modelUid: number
    userId: number
    projectId: number
    fileUrl: number
    attribution: number
    license: number
    createdAt: number
    _all: number
  }


  export type SketchfabModelMinAggregateInputType = {
    id?: true
    modelUid?: true
    userId?: true
    projectId?: true
    fileUrl?: true
    license?: true
    createdAt?: true
  }

  export type SketchfabModelMaxAggregateInputType = {
    id?: true
    modelUid?: true
    userId?: true
    projectId?: true
    fileUrl?: true
    license?: true
    createdAt?: true
  }

  export type SketchfabModelCountAggregateInputType = {
    id?: true
    modelUid?: true
    userId?: true
    projectId?: true
    fileUrl?: true
    attribution?: true
    license?: true
    createdAt?: true
    _all?: true
  }

  export type SketchfabModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SketchfabModel to aggregate.
     */
    where?: SketchfabModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabModels to fetch.
     */
    orderBy?: SketchfabModelOrderByWithRelationInput | SketchfabModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SketchfabModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SketchfabModels
    **/
    _count?: true | SketchfabModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SketchfabModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SketchfabModelMaxAggregateInputType
  }

  export type GetSketchfabModelAggregateType<T extends SketchfabModelAggregateArgs> = {
        [P in keyof T & keyof AggregateSketchfabModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSketchfabModel[P]>
      : GetScalarType<T[P], AggregateSketchfabModel[P]>
  }




  export type SketchfabModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SketchfabModelWhereInput
    orderBy?: SketchfabModelOrderByWithAggregationInput | SketchfabModelOrderByWithAggregationInput[]
    by: SketchfabModelScalarFieldEnum[] | SketchfabModelScalarFieldEnum
    having?: SketchfabModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SketchfabModelCountAggregateInputType | true
    _min?: SketchfabModelMinAggregateInputType
    _max?: SketchfabModelMaxAggregateInputType
  }

  export type SketchfabModelGroupByOutputType = {
    id: string
    modelUid: string
    userId: string
    projectId: string
    fileUrl: string
    attribution: JsonValue
    license: string
    createdAt: Date
    _count: SketchfabModelCountAggregateOutputType | null
    _min: SketchfabModelMinAggregateOutputType | null
    _max: SketchfabModelMaxAggregateOutputType | null
  }

  type GetSketchfabModelGroupByPayload<T extends SketchfabModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SketchfabModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SketchfabModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SketchfabModelGroupByOutputType[P]>
            : GetScalarType<T[P], SketchfabModelGroupByOutputType[P]>
        }
      >
    >


  export type SketchfabModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelUid?: boolean
    userId?: boolean
    projectId?: boolean
    fileUrl?: boolean
    attribution?: boolean
    license?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sketchfabModel"]>

  export type SketchfabModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelUid?: boolean
    userId?: boolean
    projectId?: boolean
    fileUrl?: boolean
    attribution?: boolean
    license?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sketchfabModel"]>

  export type SketchfabModelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelUid?: boolean
    userId?: boolean
    projectId?: boolean
    fileUrl?: boolean
    attribution?: boolean
    license?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sketchfabModel"]>

  export type SketchfabModelSelectScalar = {
    id?: boolean
    modelUid?: boolean
    userId?: boolean
    projectId?: boolean
    fileUrl?: boolean
    attribution?: boolean
    license?: boolean
    createdAt?: boolean
  }

  export type SketchfabModelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "modelUid" | "userId" | "projectId" | "fileUrl" | "attribution" | "license" | "createdAt", ExtArgs["result"]["sketchfabModel"]>
  export type SketchfabModelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type SketchfabModelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type SketchfabModelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $SketchfabModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SketchfabModel"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      modelUid: string
      userId: string
      projectId: string
      fileUrl: string
      attribution: Prisma.JsonValue
      license: string
      createdAt: Date
    }, ExtArgs["result"]["sketchfabModel"]>
    composites: {}
  }

  type SketchfabModelGetPayload<S extends boolean | null | undefined | SketchfabModelDefaultArgs> = $Result.GetResult<Prisma.$SketchfabModelPayload, S>

  type SketchfabModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SketchfabModelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SketchfabModelCountAggregateInputType | true
    }

  export interface SketchfabModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SketchfabModel'], meta: { name: 'SketchfabModel' } }
    /**
     * Find zero or one SketchfabModel that matches the filter.
     * @param {SketchfabModelFindUniqueArgs} args - Arguments to find a SketchfabModel
     * @example
     * // Get one SketchfabModel
     * const sketchfabModel = await prisma.sketchfabModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SketchfabModelFindUniqueArgs>(args: SelectSubset<T, SketchfabModelFindUniqueArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SketchfabModel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SketchfabModelFindUniqueOrThrowArgs} args - Arguments to find a SketchfabModel
     * @example
     * // Get one SketchfabModel
     * const sketchfabModel = await prisma.sketchfabModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SketchfabModelFindUniqueOrThrowArgs>(args: SelectSubset<T, SketchfabModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SketchfabModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelFindFirstArgs} args - Arguments to find a SketchfabModel
     * @example
     * // Get one SketchfabModel
     * const sketchfabModel = await prisma.sketchfabModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SketchfabModelFindFirstArgs>(args?: SelectSubset<T, SketchfabModelFindFirstArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SketchfabModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelFindFirstOrThrowArgs} args - Arguments to find a SketchfabModel
     * @example
     * // Get one SketchfabModel
     * const sketchfabModel = await prisma.sketchfabModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SketchfabModelFindFirstOrThrowArgs>(args?: SelectSubset<T, SketchfabModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SketchfabModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SketchfabModels
     * const sketchfabModels = await prisma.sketchfabModel.findMany()
     * 
     * // Get first 10 SketchfabModels
     * const sketchfabModels = await prisma.sketchfabModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sketchfabModelWithIdOnly = await prisma.sketchfabModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SketchfabModelFindManyArgs>(args?: SelectSubset<T, SketchfabModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SketchfabModel.
     * @param {SketchfabModelCreateArgs} args - Arguments to create a SketchfabModel.
     * @example
     * // Create one SketchfabModel
     * const SketchfabModel = await prisma.sketchfabModel.create({
     *   data: {
     *     // ... data to create a SketchfabModel
     *   }
     * })
     * 
     */
    create<T extends SketchfabModelCreateArgs>(args: SelectSubset<T, SketchfabModelCreateArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SketchfabModels.
     * @param {SketchfabModelCreateManyArgs} args - Arguments to create many SketchfabModels.
     * @example
     * // Create many SketchfabModels
     * const sketchfabModel = await prisma.sketchfabModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SketchfabModelCreateManyArgs>(args?: SelectSubset<T, SketchfabModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SketchfabModels and returns the data saved in the database.
     * @param {SketchfabModelCreateManyAndReturnArgs} args - Arguments to create many SketchfabModels.
     * @example
     * // Create many SketchfabModels
     * const sketchfabModel = await prisma.sketchfabModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SketchfabModels and only return the `id`
     * const sketchfabModelWithIdOnly = await prisma.sketchfabModel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SketchfabModelCreateManyAndReturnArgs>(args?: SelectSubset<T, SketchfabModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SketchfabModel.
     * @param {SketchfabModelDeleteArgs} args - Arguments to delete one SketchfabModel.
     * @example
     * // Delete one SketchfabModel
     * const SketchfabModel = await prisma.sketchfabModel.delete({
     *   where: {
     *     // ... filter to delete one SketchfabModel
     *   }
     * })
     * 
     */
    delete<T extends SketchfabModelDeleteArgs>(args: SelectSubset<T, SketchfabModelDeleteArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SketchfabModel.
     * @param {SketchfabModelUpdateArgs} args - Arguments to update one SketchfabModel.
     * @example
     * // Update one SketchfabModel
     * const sketchfabModel = await prisma.sketchfabModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SketchfabModelUpdateArgs>(args: SelectSubset<T, SketchfabModelUpdateArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SketchfabModels.
     * @param {SketchfabModelDeleteManyArgs} args - Arguments to filter SketchfabModels to delete.
     * @example
     * // Delete a few SketchfabModels
     * const { count } = await prisma.sketchfabModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SketchfabModelDeleteManyArgs>(args?: SelectSubset<T, SketchfabModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SketchfabModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SketchfabModels
     * const sketchfabModel = await prisma.sketchfabModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SketchfabModelUpdateManyArgs>(args: SelectSubset<T, SketchfabModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SketchfabModels and returns the data updated in the database.
     * @param {SketchfabModelUpdateManyAndReturnArgs} args - Arguments to update many SketchfabModels.
     * @example
     * // Update many SketchfabModels
     * const sketchfabModel = await prisma.sketchfabModel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SketchfabModels and only return the `id`
     * const sketchfabModelWithIdOnly = await prisma.sketchfabModel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SketchfabModelUpdateManyAndReturnArgs>(args: SelectSubset<T, SketchfabModelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SketchfabModel.
     * @param {SketchfabModelUpsertArgs} args - Arguments to update or create a SketchfabModel.
     * @example
     * // Update or create a SketchfabModel
     * const sketchfabModel = await prisma.sketchfabModel.upsert({
     *   create: {
     *     // ... data to create a SketchfabModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SketchfabModel we want to update
     *   }
     * })
     */
    upsert<T extends SketchfabModelUpsertArgs>(args: SelectSubset<T, SketchfabModelUpsertArgs<ExtArgs>>): Prisma__SketchfabModelClient<$Result.GetResult<Prisma.$SketchfabModelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SketchfabModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelCountArgs} args - Arguments to filter SketchfabModels to count.
     * @example
     * // Count the number of SketchfabModels
     * const count = await prisma.sketchfabModel.count({
     *   where: {
     *     // ... the filter for the SketchfabModels we want to count
     *   }
     * })
    **/
    count<T extends SketchfabModelCountArgs>(
      args?: Subset<T, SketchfabModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SketchfabModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SketchfabModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SketchfabModelAggregateArgs>(args: Subset<T, SketchfabModelAggregateArgs>): Prisma.PrismaPromise<GetSketchfabModelAggregateType<T>>

    /**
     * Group by SketchfabModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SketchfabModelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SketchfabModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SketchfabModelGroupByArgs['orderBy'] }
        : { orderBy?: SketchfabModelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SketchfabModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSketchfabModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SketchfabModel model
   */
  readonly fields: SketchfabModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SketchfabModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SketchfabModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SketchfabModel model
   */
  interface SketchfabModelFieldRefs {
    readonly id: FieldRef<"SketchfabModel", 'String'>
    readonly modelUid: FieldRef<"SketchfabModel", 'String'>
    readonly userId: FieldRef<"SketchfabModel", 'String'>
    readonly projectId: FieldRef<"SketchfabModel", 'String'>
    readonly fileUrl: FieldRef<"SketchfabModel", 'String'>
    readonly attribution: FieldRef<"SketchfabModel", 'Json'>
    readonly license: FieldRef<"SketchfabModel", 'String'>
    readonly createdAt: FieldRef<"SketchfabModel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SketchfabModel findUnique
   */
  export type SketchfabModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabModel to fetch.
     */
    where: SketchfabModelWhereUniqueInput
  }

  /**
   * SketchfabModel findUniqueOrThrow
   */
  export type SketchfabModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabModel to fetch.
     */
    where: SketchfabModelWhereUniqueInput
  }

  /**
   * SketchfabModel findFirst
   */
  export type SketchfabModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabModel to fetch.
     */
    where?: SketchfabModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabModels to fetch.
     */
    orderBy?: SketchfabModelOrderByWithRelationInput | SketchfabModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SketchfabModels.
     */
    cursor?: SketchfabModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SketchfabModels.
     */
    distinct?: SketchfabModelScalarFieldEnum | SketchfabModelScalarFieldEnum[]
  }

  /**
   * SketchfabModel findFirstOrThrow
   */
  export type SketchfabModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabModel to fetch.
     */
    where?: SketchfabModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabModels to fetch.
     */
    orderBy?: SketchfabModelOrderByWithRelationInput | SketchfabModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SketchfabModels.
     */
    cursor?: SketchfabModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SketchfabModels.
     */
    distinct?: SketchfabModelScalarFieldEnum | SketchfabModelScalarFieldEnum[]
  }

  /**
   * SketchfabModel findMany
   */
  export type SketchfabModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * Filter, which SketchfabModels to fetch.
     */
    where?: SketchfabModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SketchfabModels to fetch.
     */
    orderBy?: SketchfabModelOrderByWithRelationInput | SketchfabModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SketchfabModels.
     */
    cursor?: SketchfabModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SketchfabModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SketchfabModels.
     */
    skip?: number
    distinct?: SketchfabModelScalarFieldEnum | SketchfabModelScalarFieldEnum[]
  }

  /**
   * SketchfabModel create
   */
  export type SketchfabModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * The data needed to create a SketchfabModel.
     */
    data: XOR<SketchfabModelCreateInput, SketchfabModelUncheckedCreateInput>
  }

  /**
   * SketchfabModel createMany
   */
  export type SketchfabModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SketchfabModels.
     */
    data: SketchfabModelCreateManyInput | SketchfabModelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SketchfabModel createManyAndReturn
   */
  export type SketchfabModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * The data used to create many SketchfabModels.
     */
    data: SketchfabModelCreateManyInput | SketchfabModelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SketchfabModel update
   */
  export type SketchfabModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * The data needed to update a SketchfabModel.
     */
    data: XOR<SketchfabModelUpdateInput, SketchfabModelUncheckedUpdateInput>
    /**
     * Choose, which SketchfabModel to update.
     */
    where: SketchfabModelWhereUniqueInput
  }

  /**
   * SketchfabModel updateMany
   */
  export type SketchfabModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SketchfabModels.
     */
    data: XOR<SketchfabModelUpdateManyMutationInput, SketchfabModelUncheckedUpdateManyInput>
    /**
     * Filter which SketchfabModels to update
     */
    where?: SketchfabModelWhereInput
    /**
     * Limit how many SketchfabModels to update.
     */
    limit?: number
  }

  /**
   * SketchfabModel updateManyAndReturn
   */
  export type SketchfabModelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * The data used to update SketchfabModels.
     */
    data: XOR<SketchfabModelUpdateManyMutationInput, SketchfabModelUncheckedUpdateManyInput>
    /**
     * Filter which SketchfabModels to update
     */
    where?: SketchfabModelWhereInput
    /**
     * Limit how many SketchfabModels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SketchfabModel upsert
   */
  export type SketchfabModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * The filter to search for the SketchfabModel to update in case it exists.
     */
    where: SketchfabModelWhereUniqueInput
    /**
     * In case the SketchfabModel found by the `where` argument doesn't exist, create a new SketchfabModel with this data.
     */
    create: XOR<SketchfabModelCreateInput, SketchfabModelUncheckedCreateInput>
    /**
     * In case the SketchfabModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SketchfabModelUpdateInput, SketchfabModelUncheckedUpdateInput>
  }

  /**
   * SketchfabModel delete
   */
  export type SketchfabModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
    /**
     * Filter which SketchfabModel to delete.
     */
    where: SketchfabModelWhereUniqueInput
  }

  /**
   * SketchfabModel deleteMany
   */
  export type SketchfabModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SketchfabModels to delete
     */
    where?: SketchfabModelWhereInput
    /**
     * Limit how many SketchfabModels to delete.
     */
    limit?: number
  }

  /**
   * SketchfabModel without action
   */
  export type SketchfabModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SketchfabModel
     */
    select?: SketchfabModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SketchfabModel
     */
    omit?: SketchfabModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SketchfabModelInclude<ExtArgs> | null
  }


  /**
   * Model CadBlock
   */

  export type AggregateCadBlock = {
    _count: CadBlockCountAggregateOutputType | null
    _avg: CadBlockAvgAggregateOutputType | null
    _sum: CadBlockSumAggregateOutputType | null
    _min: CadBlockMinAggregateOutputType | null
    _max: CadBlockMaxAggregateOutputType | null
  }

  export type CadBlockAvgAggregateOutputType = {
    width: number | null
    depth: number | null
  }

  export type CadBlockSumAggregateOutputType = {
    width: number | null
    depth: number | null
  }

  export type CadBlockMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    subcategory: string | null
    dxfUrl: string | null
    thumbnailUrl: string | null
    width: number | null
    depth: number | null
    isPublic: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CadBlockMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    subcategory: string | null
    dxfUrl: string | null
    thumbnailUrl: string | null
    width: number | null
    depth: number | null
    isPublic: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CadBlockCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    category: number
    subcategory: number
    tags: number
    dxfUrl: number
    thumbnailUrl: number
    width: number
    depth: number
    isPublic: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CadBlockAvgAggregateInputType = {
    width?: true
    depth?: true
  }

  export type CadBlockSumAggregateInputType = {
    width?: true
    depth?: true
  }

  export type CadBlockMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    subcategory?: true
    dxfUrl?: true
    thumbnailUrl?: true
    width?: true
    depth?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CadBlockMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    subcategory?: true
    dxfUrl?: true
    thumbnailUrl?: true
    width?: true
    depth?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CadBlockCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    subcategory?: true
    tags?: true
    dxfUrl?: true
    thumbnailUrl?: true
    width?: true
    depth?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CadBlockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CadBlock to aggregate.
     */
    where?: CadBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CadBlocks to fetch.
     */
    orderBy?: CadBlockOrderByWithRelationInput | CadBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CadBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CadBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CadBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CadBlocks
    **/
    _count?: true | CadBlockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CadBlockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CadBlockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CadBlockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CadBlockMaxAggregateInputType
  }

  export type GetCadBlockAggregateType<T extends CadBlockAggregateArgs> = {
        [P in keyof T & keyof AggregateCadBlock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCadBlock[P]>
      : GetScalarType<T[P], AggregateCadBlock[P]>
  }




  export type CadBlockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CadBlockWhereInput
    orderBy?: CadBlockOrderByWithAggregationInput | CadBlockOrderByWithAggregationInput[]
    by: CadBlockScalarFieldEnum[] | CadBlockScalarFieldEnum
    having?: CadBlockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CadBlockCountAggregateInputType | true
    _avg?: CadBlockAvgAggregateInputType
    _sum?: CadBlockSumAggregateInputType
    _min?: CadBlockMinAggregateInputType
    _max?: CadBlockMaxAggregateInputType
  }

  export type CadBlockGroupByOutputType = {
    id: string
    slug: string
    name: string
    category: string
    subcategory: string | null
    tags: string[]
    dxfUrl: string
    thumbnailUrl: string
    width: number | null
    depth: number | null
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
    _count: CadBlockCountAggregateOutputType | null
    _avg: CadBlockAvgAggregateOutputType | null
    _sum: CadBlockSumAggregateOutputType | null
    _min: CadBlockMinAggregateOutputType | null
    _max: CadBlockMaxAggregateOutputType | null
  }

  type GetCadBlockGroupByPayload<T extends CadBlockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CadBlockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CadBlockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CadBlockGroupByOutputType[P]>
            : GetScalarType<T[P], CadBlockGroupByOutputType[P]>
        }
      >
    >


  export type CadBlockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    subcategory?: boolean
    tags?: boolean
    dxfUrl?: boolean
    thumbnailUrl?: boolean
    width?: boolean
    depth?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cadBlock"]>

  export type CadBlockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    subcategory?: boolean
    tags?: boolean
    dxfUrl?: boolean
    thumbnailUrl?: boolean
    width?: boolean
    depth?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cadBlock"]>

  export type CadBlockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    subcategory?: boolean
    tags?: boolean
    dxfUrl?: boolean
    thumbnailUrl?: boolean
    width?: boolean
    depth?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cadBlock"]>

  export type CadBlockSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    subcategory?: boolean
    tags?: boolean
    dxfUrl?: boolean
    thumbnailUrl?: boolean
    width?: boolean
    depth?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CadBlockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "category" | "subcategory" | "tags" | "dxfUrl" | "thumbnailUrl" | "width" | "depth" | "isPublic" | "createdAt" | "updatedAt", ExtArgs["result"]["cadBlock"]>

  export type $CadBlockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CadBlock"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      category: string
      subcategory: string | null
      tags: string[]
      dxfUrl: string
      thumbnailUrl: string
      width: number | null
      depth: number | null
      isPublic: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cadBlock"]>
    composites: {}
  }

  type CadBlockGetPayload<S extends boolean | null | undefined | CadBlockDefaultArgs> = $Result.GetResult<Prisma.$CadBlockPayload, S>

  type CadBlockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CadBlockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CadBlockCountAggregateInputType | true
    }

  export interface CadBlockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CadBlock'], meta: { name: 'CadBlock' } }
    /**
     * Find zero or one CadBlock that matches the filter.
     * @param {CadBlockFindUniqueArgs} args - Arguments to find a CadBlock
     * @example
     * // Get one CadBlock
     * const cadBlock = await prisma.cadBlock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CadBlockFindUniqueArgs>(args: SelectSubset<T, CadBlockFindUniqueArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CadBlock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CadBlockFindUniqueOrThrowArgs} args - Arguments to find a CadBlock
     * @example
     * // Get one CadBlock
     * const cadBlock = await prisma.cadBlock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CadBlockFindUniqueOrThrowArgs>(args: SelectSubset<T, CadBlockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CadBlock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockFindFirstArgs} args - Arguments to find a CadBlock
     * @example
     * // Get one CadBlock
     * const cadBlock = await prisma.cadBlock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CadBlockFindFirstArgs>(args?: SelectSubset<T, CadBlockFindFirstArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CadBlock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockFindFirstOrThrowArgs} args - Arguments to find a CadBlock
     * @example
     * // Get one CadBlock
     * const cadBlock = await prisma.cadBlock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CadBlockFindFirstOrThrowArgs>(args?: SelectSubset<T, CadBlockFindFirstOrThrowArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CadBlocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CadBlocks
     * const cadBlocks = await prisma.cadBlock.findMany()
     * 
     * // Get first 10 CadBlocks
     * const cadBlocks = await prisma.cadBlock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cadBlockWithIdOnly = await prisma.cadBlock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CadBlockFindManyArgs>(args?: SelectSubset<T, CadBlockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CadBlock.
     * @param {CadBlockCreateArgs} args - Arguments to create a CadBlock.
     * @example
     * // Create one CadBlock
     * const CadBlock = await prisma.cadBlock.create({
     *   data: {
     *     // ... data to create a CadBlock
     *   }
     * })
     * 
     */
    create<T extends CadBlockCreateArgs>(args: SelectSubset<T, CadBlockCreateArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CadBlocks.
     * @param {CadBlockCreateManyArgs} args - Arguments to create many CadBlocks.
     * @example
     * // Create many CadBlocks
     * const cadBlock = await prisma.cadBlock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CadBlockCreateManyArgs>(args?: SelectSubset<T, CadBlockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CadBlocks and returns the data saved in the database.
     * @param {CadBlockCreateManyAndReturnArgs} args - Arguments to create many CadBlocks.
     * @example
     * // Create many CadBlocks
     * const cadBlock = await prisma.cadBlock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CadBlocks and only return the `id`
     * const cadBlockWithIdOnly = await prisma.cadBlock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CadBlockCreateManyAndReturnArgs>(args?: SelectSubset<T, CadBlockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CadBlock.
     * @param {CadBlockDeleteArgs} args - Arguments to delete one CadBlock.
     * @example
     * // Delete one CadBlock
     * const CadBlock = await prisma.cadBlock.delete({
     *   where: {
     *     // ... filter to delete one CadBlock
     *   }
     * })
     * 
     */
    delete<T extends CadBlockDeleteArgs>(args: SelectSubset<T, CadBlockDeleteArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CadBlock.
     * @param {CadBlockUpdateArgs} args - Arguments to update one CadBlock.
     * @example
     * // Update one CadBlock
     * const cadBlock = await prisma.cadBlock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CadBlockUpdateArgs>(args: SelectSubset<T, CadBlockUpdateArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CadBlocks.
     * @param {CadBlockDeleteManyArgs} args - Arguments to filter CadBlocks to delete.
     * @example
     * // Delete a few CadBlocks
     * const { count } = await prisma.cadBlock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CadBlockDeleteManyArgs>(args?: SelectSubset<T, CadBlockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CadBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CadBlocks
     * const cadBlock = await prisma.cadBlock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CadBlockUpdateManyArgs>(args: SelectSubset<T, CadBlockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CadBlocks and returns the data updated in the database.
     * @param {CadBlockUpdateManyAndReturnArgs} args - Arguments to update many CadBlocks.
     * @example
     * // Update many CadBlocks
     * const cadBlock = await prisma.cadBlock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CadBlocks and only return the `id`
     * const cadBlockWithIdOnly = await prisma.cadBlock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CadBlockUpdateManyAndReturnArgs>(args: SelectSubset<T, CadBlockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CadBlock.
     * @param {CadBlockUpsertArgs} args - Arguments to update or create a CadBlock.
     * @example
     * // Update or create a CadBlock
     * const cadBlock = await prisma.cadBlock.upsert({
     *   create: {
     *     // ... data to create a CadBlock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CadBlock we want to update
     *   }
     * })
     */
    upsert<T extends CadBlockUpsertArgs>(args: SelectSubset<T, CadBlockUpsertArgs<ExtArgs>>): Prisma__CadBlockClient<$Result.GetResult<Prisma.$CadBlockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CadBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockCountArgs} args - Arguments to filter CadBlocks to count.
     * @example
     * // Count the number of CadBlocks
     * const count = await prisma.cadBlock.count({
     *   where: {
     *     // ... the filter for the CadBlocks we want to count
     *   }
     * })
    **/
    count<T extends CadBlockCountArgs>(
      args?: Subset<T, CadBlockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CadBlockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CadBlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CadBlockAggregateArgs>(args: Subset<T, CadBlockAggregateArgs>): Prisma.PrismaPromise<GetCadBlockAggregateType<T>>

    /**
     * Group by CadBlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CadBlockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CadBlockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CadBlockGroupByArgs['orderBy'] }
        : { orderBy?: CadBlockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CadBlockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCadBlockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CadBlock model
   */
  readonly fields: CadBlockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CadBlock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CadBlockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CadBlock model
   */
  interface CadBlockFieldRefs {
    readonly id: FieldRef<"CadBlock", 'String'>
    readonly slug: FieldRef<"CadBlock", 'String'>
    readonly name: FieldRef<"CadBlock", 'String'>
    readonly category: FieldRef<"CadBlock", 'String'>
    readonly subcategory: FieldRef<"CadBlock", 'String'>
    readonly tags: FieldRef<"CadBlock", 'String[]'>
    readonly dxfUrl: FieldRef<"CadBlock", 'String'>
    readonly thumbnailUrl: FieldRef<"CadBlock", 'String'>
    readonly width: FieldRef<"CadBlock", 'Float'>
    readonly depth: FieldRef<"CadBlock", 'Float'>
    readonly isPublic: FieldRef<"CadBlock", 'Boolean'>
    readonly createdAt: FieldRef<"CadBlock", 'DateTime'>
    readonly updatedAt: FieldRef<"CadBlock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CadBlock findUnique
   */
  export type CadBlockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * Filter, which CadBlock to fetch.
     */
    where: CadBlockWhereUniqueInput
  }

  /**
   * CadBlock findUniqueOrThrow
   */
  export type CadBlockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * Filter, which CadBlock to fetch.
     */
    where: CadBlockWhereUniqueInput
  }

  /**
   * CadBlock findFirst
   */
  export type CadBlockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * Filter, which CadBlock to fetch.
     */
    where?: CadBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CadBlocks to fetch.
     */
    orderBy?: CadBlockOrderByWithRelationInput | CadBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CadBlocks.
     */
    cursor?: CadBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CadBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CadBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CadBlocks.
     */
    distinct?: CadBlockScalarFieldEnum | CadBlockScalarFieldEnum[]
  }

  /**
   * CadBlock findFirstOrThrow
   */
  export type CadBlockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * Filter, which CadBlock to fetch.
     */
    where?: CadBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CadBlocks to fetch.
     */
    orderBy?: CadBlockOrderByWithRelationInput | CadBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CadBlocks.
     */
    cursor?: CadBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CadBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CadBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CadBlocks.
     */
    distinct?: CadBlockScalarFieldEnum | CadBlockScalarFieldEnum[]
  }

  /**
   * CadBlock findMany
   */
  export type CadBlockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * Filter, which CadBlocks to fetch.
     */
    where?: CadBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CadBlocks to fetch.
     */
    orderBy?: CadBlockOrderByWithRelationInput | CadBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CadBlocks.
     */
    cursor?: CadBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CadBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CadBlocks.
     */
    skip?: number
    distinct?: CadBlockScalarFieldEnum | CadBlockScalarFieldEnum[]
  }

  /**
   * CadBlock create
   */
  export type CadBlockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * The data needed to create a CadBlock.
     */
    data: XOR<CadBlockCreateInput, CadBlockUncheckedCreateInput>
  }

  /**
   * CadBlock createMany
   */
  export type CadBlockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CadBlocks.
     */
    data: CadBlockCreateManyInput | CadBlockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CadBlock createManyAndReturn
   */
  export type CadBlockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * The data used to create many CadBlocks.
     */
    data: CadBlockCreateManyInput | CadBlockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CadBlock update
   */
  export type CadBlockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * The data needed to update a CadBlock.
     */
    data: XOR<CadBlockUpdateInput, CadBlockUncheckedUpdateInput>
    /**
     * Choose, which CadBlock to update.
     */
    where: CadBlockWhereUniqueInput
  }

  /**
   * CadBlock updateMany
   */
  export type CadBlockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CadBlocks.
     */
    data: XOR<CadBlockUpdateManyMutationInput, CadBlockUncheckedUpdateManyInput>
    /**
     * Filter which CadBlocks to update
     */
    where?: CadBlockWhereInput
    /**
     * Limit how many CadBlocks to update.
     */
    limit?: number
  }

  /**
   * CadBlock updateManyAndReturn
   */
  export type CadBlockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * The data used to update CadBlocks.
     */
    data: XOR<CadBlockUpdateManyMutationInput, CadBlockUncheckedUpdateManyInput>
    /**
     * Filter which CadBlocks to update
     */
    where?: CadBlockWhereInput
    /**
     * Limit how many CadBlocks to update.
     */
    limit?: number
  }

  /**
   * CadBlock upsert
   */
  export type CadBlockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * The filter to search for the CadBlock to update in case it exists.
     */
    where: CadBlockWhereUniqueInput
    /**
     * In case the CadBlock found by the `where` argument doesn't exist, create a new CadBlock with this data.
     */
    create: XOR<CadBlockCreateInput, CadBlockUncheckedCreateInput>
    /**
     * In case the CadBlock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CadBlockUpdateInput, CadBlockUncheckedUpdateInput>
  }

  /**
   * CadBlock delete
   */
  export type CadBlockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
    /**
     * Filter which CadBlock to delete.
     */
    where: CadBlockWhereUniqueInput
  }

  /**
   * CadBlock deleteMany
   */
  export type CadBlockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CadBlocks to delete
     */
    where?: CadBlockWhereInput
    /**
     * Limit how many CadBlocks to delete.
     */
    limit?: number
  }

  /**
   * CadBlock without action
   */
  export type CadBlockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CadBlock
     */
    select?: CadBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CadBlock
     */
    omit?: CadBlockOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    clerkId: 'clerkId',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    settings: 'settings'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const SiteAnalysisScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    sunPathData: 'sunPathData',
    weatherData: 'weatherData',
    topographyData: 'topographyData',
    contextData: 'contextData',
    analysisResults: 'analysisResults',
    boundary: 'boundary',
    coordinates: 'coordinates'
  };

  export type SiteAnalysisScalarFieldEnum = (typeof SiteAnalysisScalarFieldEnum)[keyof typeof SiteAnalysisScalarFieldEnum]


  export const FloorplanScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    level: 'level',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    data: 'data'
  };

  export type FloorplanScalarFieldEnum = (typeof FloorplanScalarFieldEnum)[keyof typeof FloorplanScalarFieldEnum]


  export const Model3DScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    floorplanId: 'floorplanId',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    modelData: 'modelData',
    settings: 'settings'
  };

  export type Model3DScalarFieldEnum = (typeof Model3DScalarFieldEnum)[keyof typeof Model3DScalarFieldEnum]


  export const MassingScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    massingData: 'massingData',
    analysis: 'analysis'
  };

  export type MassingScalarFieldEnum = (typeof MassingScalarFieldEnum)[keyof typeof MassingScalarFieldEnum]


  export const FileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectId: 'projectId',
    filename: 'filename',
    originalName: 'originalName',
    mimeType: 'mimeType',
    size: 'size',
    storageUrl: 'storageUrl',
    storagePath: 'storagePath',
    path: 'path',
    fileType: 'fileType',
    category: 'category',
    uploadedBy: 'uploadedBy',
    createdAt: 'createdAt',
    metadata: 'metadata'
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const GeospatialCacheScalarFieldEnum: {
    id: 'id',
    cacheKey: 'cacheKey',
    data: 'data',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type GeospatialCacheScalarFieldEnum = (typeof GeospatialCacheScalarFieldEnum)[keyof typeof GeospatialCacheScalarFieldEnum]


  export const SketchfabTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SketchfabTokenScalarFieldEnum = (typeof SketchfabTokenScalarFieldEnum)[keyof typeof SketchfabTokenScalarFieldEnum]


  export const SketchfabModelScalarFieldEnum: {
    id: 'id',
    modelUid: 'modelUid',
    userId: 'userId',
    projectId: 'projectId',
    fileUrl: 'fileUrl',
    attribution: 'attribution',
    license: 'license',
    createdAt: 'createdAt'
  };

  export type SketchfabModelScalarFieldEnum = (typeof SketchfabModelScalarFieldEnum)[keyof typeof SketchfabModelScalarFieldEnum]


  export const CadBlockScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    category: 'category',
    subcategory: 'subcategory',
    tags: 'tags',
    dxfUrl: 'dxfUrl',
    thumbnailUrl: 'thumbnailUrl',
    width: 'width',
    depth: 'depth',
    isPublic: 'isPublic',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CadBlockScalarFieldEnum = (typeof CadBlockScalarFieldEnum)[keyof typeof CadBlockScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    clerkId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    imageUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    sessions?: UserSessionListRelationFilter
    sketchfabTokens?: SketchfabTokenListRelationFilter
    sketchfabModels?: SketchfabModelListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    sessions?: UserSessionOrderByRelationAggregateInput
    sketchfabTokens?: SketchfabTokenOrderByRelationAggregateInput
    sketchfabModels?: SketchfabModelOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clerkId?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    imageUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    sessions?: UserSessionListRelationFilter
    sketchfabTokens?: SketchfabTokenListRelationFilter
    sketchfabModels?: SketchfabModelListRelationFilter
  }, "id" | "clerkId" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    clerkId?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    token?: StringFilter<"UserSession"> | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: StringFilter<"UserSession"> | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSession"> | string
    userId?: StringWithAggregatesFilter<"UserSession"> | string
    token?: StringWithAggregatesFilter<"UserSession"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    userId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    settings?: JsonNullableFilter<"Project">
    floorplans?: FloorplanListRelationFilter
    massings?: MassingListRelationFilter
    models3D?: Model3DListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    siteAnalysis?: XOR<SiteAnalysisNullableScalarRelationFilter, SiteAnalysisWhereInput> | null
    sketchfabModels?: SketchfabModelListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    settings?: SortOrderInput | SortOrder
    floorplans?: FloorplanOrderByRelationAggregateInput
    massings?: MassingOrderByRelationAggregateInput
    models3D?: Model3DOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    siteAnalysis?: SiteAnalysisOrderByWithRelationInput
    sketchfabModels?: SketchfabModelOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    userId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    settings?: JsonNullableFilter<"Project">
    floorplans?: FloorplanListRelationFilter
    massings?: MassingListRelationFilter
    models3D?: Model3DListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    siteAnalysis?: XOR<SiteAnalysisNullableScalarRelationFilter, SiteAnalysisWhereInput> | null
    sketchfabModels?: SketchfabModelListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    settings?: SortOrderInput | SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    settings?: JsonNullableWithAggregatesFilter<"Project">
  }

  export type SiteAnalysisWhereInput = {
    AND?: SiteAnalysisWhereInput | SiteAnalysisWhereInput[]
    OR?: SiteAnalysisWhereInput[]
    NOT?: SiteAnalysisWhereInput | SiteAnalysisWhereInput[]
    id?: StringFilter<"SiteAnalysis"> | string
    projectId?: StringFilter<"SiteAnalysis"> | string
    createdAt?: DateTimeFilter<"SiteAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SiteAnalysis"> | Date | string
    sunPathData?: JsonNullableFilter<"SiteAnalysis">
    weatherData?: JsonNullableFilter<"SiteAnalysis">
    topographyData?: JsonNullableFilter<"SiteAnalysis">
    contextData?: JsonNullableFilter<"SiteAnalysis">
    analysisResults?: JsonNullableFilter<"SiteAnalysis">
    boundary?: JsonFilter<"SiteAnalysis">
    coordinates?: JsonFilter<"SiteAnalysis">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type SiteAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sunPathData?: SortOrderInput | SortOrder
    weatherData?: SortOrderInput | SortOrder
    topographyData?: SortOrderInput | SortOrder
    contextData?: SortOrderInput | SortOrder
    analysisResults?: SortOrderInput | SortOrder
    boundary?: SortOrder
    coordinates?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type SiteAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId?: string
    AND?: SiteAnalysisWhereInput | SiteAnalysisWhereInput[]
    OR?: SiteAnalysisWhereInput[]
    NOT?: SiteAnalysisWhereInput | SiteAnalysisWhereInput[]
    createdAt?: DateTimeFilter<"SiteAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SiteAnalysis"> | Date | string
    sunPathData?: JsonNullableFilter<"SiteAnalysis">
    weatherData?: JsonNullableFilter<"SiteAnalysis">
    topographyData?: JsonNullableFilter<"SiteAnalysis">
    contextData?: JsonNullableFilter<"SiteAnalysis">
    analysisResults?: JsonNullableFilter<"SiteAnalysis">
    boundary?: JsonFilter<"SiteAnalysis">
    coordinates?: JsonFilter<"SiteAnalysis">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "projectId">

  export type SiteAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sunPathData?: SortOrderInput | SortOrder
    weatherData?: SortOrderInput | SortOrder
    topographyData?: SortOrderInput | SortOrder
    contextData?: SortOrderInput | SortOrder
    analysisResults?: SortOrderInput | SortOrder
    boundary?: SortOrder
    coordinates?: SortOrder
    _count?: SiteAnalysisCountOrderByAggregateInput
    _max?: SiteAnalysisMaxOrderByAggregateInput
    _min?: SiteAnalysisMinOrderByAggregateInput
  }

  export type SiteAnalysisScalarWhereWithAggregatesInput = {
    AND?: SiteAnalysisScalarWhereWithAggregatesInput | SiteAnalysisScalarWhereWithAggregatesInput[]
    OR?: SiteAnalysisScalarWhereWithAggregatesInput[]
    NOT?: SiteAnalysisScalarWhereWithAggregatesInput | SiteAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SiteAnalysis"> | string
    projectId?: StringWithAggregatesFilter<"SiteAnalysis"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SiteAnalysis"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SiteAnalysis"> | Date | string
    sunPathData?: JsonNullableWithAggregatesFilter<"SiteAnalysis">
    weatherData?: JsonNullableWithAggregatesFilter<"SiteAnalysis">
    topographyData?: JsonNullableWithAggregatesFilter<"SiteAnalysis">
    contextData?: JsonNullableWithAggregatesFilter<"SiteAnalysis">
    analysisResults?: JsonNullableWithAggregatesFilter<"SiteAnalysis">
    boundary?: JsonWithAggregatesFilter<"SiteAnalysis">
    coordinates?: JsonWithAggregatesFilter<"SiteAnalysis">
  }

  export type FloorplanWhereInput = {
    AND?: FloorplanWhereInput | FloorplanWhereInput[]
    OR?: FloorplanWhereInput[]
    NOT?: FloorplanWhereInput | FloorplanWhereInput[]
    id?: StringFilter<"Floorplan"> | string
    projectId?: StringFilter<"Floorplan"> | string
    name?: StringFilter<"Floorplan"> | string
    level?: IntFilter<"Floorplan"> | number
    createdAt?: DateTimeFilter<"Floorplan"> | Date | string
    updatedAt?: DateTimeFilter<"Floorplan"> | Date | string
    data?: JsonFilter<"Floorplan">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    models3D?: Model3DListRelationFilter
  }

  export type FloorplanOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    project?: ProjectOrderByWithRelationInput
    models3D?: Model3DOrderByRelationAggregateInput
  }

  export type FloorplanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FloorplanWhereInput | FloorplanWhereInput[]
    OR?: FloorplanWhereInput[]
    NOT?: FloorplanWhereInput | FloorplanWhereInput[]
    projectId?: StringFilter<"Floorplan"> | string
    name?: StringFilter<"Floorplan"> | string
    level?: IntFilter<"Floorplan"> | number
    createdAt?: DateTimeFilter<"Floorplan"> | Date | string
    updatedAt?: DateTimeFilter<"Floorplan"> | Date | string
    data?: JsonFilter<"Floorplan">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    models3D?: Model3DListRelationFilter
  }, "id">

  export type FloorplanOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    _count?: FloorplanCountOrderByAggregateInput
    _avg?: FloorplanAvgOrderByAggregateInput
    _max?: FloorplanMaxOrderByAggregateInput
    _min?: FloorplanMinOrderByAggregateInput
    _sum?: FloorplanSumOrderByAggregateInput
  }

  export type FloorplanScalarWhereWithAggregatesInput = {
    AND?: FloorplanScalarWhereWithAggregatesInput | FloorplanScalarWhereWithAggregatesInput[]
    OR?: FloorplanScalarWhereWithAggregatesInput[]
    NOT?: FloorplanScalarWhereWithAggregatesInput | FloorplanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Floorplan"> | string
    projectId?: StringWithAggregatesFilter<"Floorplan"> | string
    name?: StringWithAggregatesFilter<"Floorplan"> | string
    level?: IntWithAggregatesFilter<"Floorplan"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Floorplan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Floorplan"> | Date | string
    data?: JsonWithAggregatesFilter<"Floorplan">
  }

  export type Model3DWhereInput = {
    AND?: Model3DWhereInput | Model3DWhereInput[]
    OR?: Model3DWhereInput[]
    NOT?: Model3DWhereInput | Model3DWhereInput[]
    id?: StringFilter<"Model3D"> | string
    projectId?: StringFilter<"Model3D"> | string
    floorplanId?: StringNullableFilter<"Model3D"> | string | null
    name?: StringFilter<"Model3D"> | string
    createdAt?: DateTimeFilter<"Model3D"> | Date | string
    updatedAt?: DateTimeFilter<"Model3D"> | Date | string
    modelData?: JsonFilter<"Model3D">
    settings?: JsonNullableFilter<"Model3D">
    floorplan?: XOR<FloorplanNullableScalarRelationFilter, FloorplanWhereInput> | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type Model3DOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    floorplanId?: SortOrderInput | SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modelData?: SortOrder
    settings?: SortOrderInput | SortOrder
    floorplan?: FloorplanOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
  }

  export type Model3DWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: Model3DWhereInput | Model3DWhereInput[]
    OR?: Model3DWhereInput[]
    NOT?: Model3DWhereInput | Model3DWhereInput[]
    projectId?: StringFilter<"Model3D"> | string
    floorplanId?: StringNullableFilter<"Model3D"> | string | null
    name?: StringFilter<"Model3D"> | string
    createdAt?: DateTimeFilter<"Model3D"> | Date | string
    updatedAt?: DateTimeFilter<"Model3D"> | Date | string
    modelData?: JsonFilter<"Model3D">
    settings?: JsonNullableFilter<"Model3D">
    floorplan?: XOR<FloorplanNullableScalarRelationFilter, FloorplanWhereInput> | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type Model3DOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    floorplanId?: SortOrderInput | SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modelData?: SortOrder
    settings?: SortOrderInput | SortOrder
    _count?: Model3DCountOrderByAggregateInput
    _max?: Model3DMaxOrderByAggregateInput
    _min?: Model3DMinOrderByAggregateInput
  }

  export type Model3DScalarWhereWithAggregatesInput = {
    AND?: Model3DScalarWhereWithAggregatesInput | Model3DScalarWhereWithAggregatesInput[]
    OR?: Model3DScalarWhereWithAggregatesInput[]
    NOT?: Model3DScalarWhereWithAggregatesInput | Model3DScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Model3D"> | string
    projectId?: StringWithAggregatesFilter<"Model3D"> | string
    floorplanId?: StringNullableWithAggregatesFilter<"Model3D"> | string | null
    name?: StringWithAggregatesFilter<"Model3D"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Model3D"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Model3D"> | Date | string
    modelData?: JsonWithAggregatesFilter<"Model3D">
    settings?: JsonNullableWithAggregatesFilter<"Model3D">
  }

  export type MassingWhereInput = {
    AND?: MassingWhereInput | MassingWhereInput[]
    OR?: MassingWhereInput[]
    NOT?: MassingWhereInput | MassingWhereInput[]
    id?: StringFilter<"Massing"> | string
    projectId?: StringFilter<"Massing"> | string
    name?: StringFilter<"Massing"> | string
    createdAt?: DateTimeFilter<"Massing"> | Date | string
    updatedAt?: DateTimeFilter<"Massing"> | Date | string
    massingData?: JsonFilter<"Massing">
    analysis?: JsonNullableFilter<"Massing">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type MassingOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    massingData?: SortOrder
    analysis?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type MassingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MassingWhereInput | MassingWhereInput[]
    OR?: MassingWhereInput[]
    NOT?: MassingWhereInput | MassingWhereInput[]
    projectId?: StringFilter<"Massing"> | string
    name?: StringFilter<"Massing"> | string
    createdAt?: DateTimeFilter<"Massing"> | Date | string
    updatedAt?: DateTimeFilter<"Massing"> | Date | string
    massingData?: JsonFilter<"Massing">
    analysis?: JsonNullableFilter<"Massing">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type MassingOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    massingData?: SortOrder
    analysis?: SortOrderInput | SortOrder
    _count?: MassingCountOrderByAggregateInput
    _max?: MassingMaxOrderByAggregateInput
    _min?: MassingMinOrderByAggregateInput
  }

  export type MassingScalarWhereWithAggregatesInput = {
    AND?: MassingScalarWhereWithAggregatesInput | MassingScalarWhereWithAggregatesInput[]
    OR?: MassingScalarWhereWithAggregatesInput[]
    NOT?: MassingScalarWhereWithAggregatesInput | MassingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Massing"> | string
    projectId?: StringWithAggregatesFilter<"Massing"> | string
    name?: StringWithAggregatesFilter<"Massing"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Massing"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Massing"> | Date | string
    massingData?: JsonWithAggregatesFilter<"Massing">
    analysis?: JsonNullableWithAggregatesFilter<"Massing">
  }

  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    id?: StringFilter<"File"> | string
    userId?: StringFilter<"File"> | string
    projectId?: StringNullableFilter<"File"> | string | null
    filename?: StringFilter<"File"> | string
    originalName?: StringFilter<"File"> | string
    mimeType?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    storageUrl?: StringFilter<"File"> | string
    storagePath?: StringFilter<"File"> | string
    path?: StringNullableFilter<"File"> | string | null
    fileType?: StringFilter<"File"> | string
    category?: StringNullableFilter<"File"> | string | null
    uploadedBy?: StringNullableFilter<"File"> | string | null
    createdAt?: DateTimeFilter<"File"> | Date | string
    metadata?: JsonNullableFilter<"File">
  }

  export type FileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    storageUrl?: SortOrder
    storagePath?: SortOrder
    path?: SortOrderInput | SortOrder
    fileType?: SortOrder
    category?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
  }

  export type FileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    path?: string
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    userId?: StringFilter<"File"> | string
    projectId?: StringNullableFilter<"File"> | string | null
    filename?: StringFilter<"File"> | string
    originalName?: StringFilter<"File"> | string
    mimeType?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    storageUrl?: StringFilter<"File"> | string
    storagePath?: StringFilter<"File"> | string
    fileType?: StringFilter<"File"> | string
    category?: StringNullableFilter<"File"> | string | null
    uploadedBy?: StringNullableFilter<"File"> | string | null
    createdAt?: DateTimeFilter<"File"> | Date | string
    metadata?: JsonNullableFilter<"File">
  }, "id" | "path">

  export type FileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    storageUrl?: SortOrder
    storagePath?: SortOrder
    path?: SortOrderInput | SortOrder
    fileType?: SortOrder
    category?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    OR?: FileScalarWhereWithAggregatesInput[]
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"File"> | string
    userId?: StringWithAggregatesFilter<"File"> | string
    projectId?: StringNullableWithAggregatesFilter<"File"> | string | null
    filename?: StringWithAggregatesFilter<"File"> | string
    originalName?: StringWithAggregatesFilter<"File"> | string
    mimeType?: StringWithAggregatesFilter<"File"> | string
    size?: IntWithAggregatesFilter<"File"> | number
    storageUrl?: StringWithAggregatesFilter<"File"> | string
    storagePath?: StringWithAggregatesFilter<"File"> | string
    path?: StringNullableWithAggregatesFilter<"File"> | string | null
    fileType?: StringWithAggregatesFilter<"File"> | string
    category?: StringNullableWithAggregatesFilter<"File"> | string | null
    uploadedBy?: StringNullableWithAggregatesFilter<"File"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"File">
  }

  export type GeospatialCacheWhereInput = {
    AND?: GeospatialCacheWhereInput | GeospatialCacheWhereInput[]
    OR?: GeospatialCacheWhereInput[]
    NOT?: GeospatialCacheWhereInput | GeospatialCacheWhereInput[]
    id?: StringFilter<"GeospatialCache"> | string
    cacheKey?: StringFilter<"GeospatialCache"> | string
    data?: JsonFilter<"GeospatialCache">
    expiresAt?: DateTimeFilter<"GeospatialCache"> | Date | string
    createdAt?: DateTimeFilter<"GeospatialCache"> | Date | string
  }

  export type GeospatialCacheOrderByWithRelationInput = {
    id?: SortOrder
    cacheKey?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GeospatialCacheWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cacheKey?: string
    AND?: GeospatialCacheWhereInput | GeospatialCacheWhereInput[]
    OR?: GeospatialCacheWhereInput[]
    NOT?: GeospatialCacheWhereInput | GeospatialCacheWhereInput[]
    data?: JsonFilter<"GeospatialCache">
    expiresAt?: DateTimeFilter<"GeospatialCache"> | Date | string
    createdAt?: DateTimeFilter<"GeospatialCache"> | Date | string
  }, "id" | "cacheKey">

  export type GeospatialCacheOrderByWithAggregationInput = {
    id?: SortOrder
    cacheKey?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: GeospatialCacheCountOrderByAggregateInput
    _max?: GeospatialCacheMaxOrderByAggregateInput
    _min?: GeospatialCacheMinOrderByAggregateInput
  }

  export type GeospatialCacheScalarWhereWithAggregatesInput = {
    AND?: GeospatialCacheScalarWhereWithAggregatesInput | GeospatialCacheScalarWhereWithAggregatesInput[]
    OR?: GeospatialCacheScalarWhereWithAggregatesInput[]
    NOT?: GeospatialCacheScalarWhereWithAggregatesInput | GeospatialCacheScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GeospatialCache"> | string
    cacheKey?: StringWithAggregatesFilter<"GeospatialCache"> | string
    data?: JsonWithAggregatesFilter<"GeospatialCache">
    expiresAt?: DateTimeWithAggregatesFilter<"GeospatialCache"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"GeospatialCache"> | Date | string
  }

  export type SketchfabTokenWhereInput = {
    AND?: SketchfabTokenWhereInput | SketchfabTokenWhereInput[]
    OR?: SketchfabTokenWhereInput[]
    NOT?: SketchfabTokenWhereInput | SketchfabTokenWhereInput[]
    id?: StringFilter<"SketchfabToken"> | string
    userId?: StringFilter<"SketchfabToken"> | string
    accessToken?: StringFilter<"SketchfabToken"> | string
    refreshToken?: StringFilter<"SketchfabToken"> | string
    expiresAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    createdAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    updatedAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SketchfabTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SketchfabTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: SketchfabTokenWhereInput | SketchfabTokenWhereInput[]
    OR?: SketchfabTokenWhereInput[]
    NOT?: SketchfabTokenWhereInput | SketchfabTokenWhereInput[]
    accessToken?: StringFilter<"SketchfabToken"> | string
    refreshToken?: StringFilter<"SketchfabToken"> | string
    expiresAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    createdAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    updatedAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type SketchfabTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SketchfabTokenCountOrderByAggregateInput
    _max?: SketchfabTokenMaxOrderByAggregateInput
    _min?: SketchfabTokenMinOrderByAggregateInput
  }

  export type SketchfabTokenScalarWhereWithAggregatesInput = {
    AND?: SketchfabTokenScalarWhereWithAggregatesInput | SketchfabTokenScalarWhereWithAggregatesInput[]
    OR?: SketchfabTokenScalarWhereWithAggregatesInput[]
    NOT?: SketchfabTokenScalarWhereWithAggregatesInput | SketchfabTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SketchfabToken"> | string
    userId?: StringWithAggregatesFilter<"SketchfabToken"> | string
    accessToken?: StringWithAggregatesFilter<"SketchfabToken"> | string
    refreshToken?: StringWithAggregatesFilter<"SketchfabToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"SketchfabToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SketchfabToken"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SketchfabToken"> | Date | string
  }

  export type SketchfabModelWhereInput = {
    AND?: SketchfabModelWhereInput | SketchfabModelWhereInput[]
    OR?: SketchfabModelWhereInput[]
    NOT?: SketchfabModelWhereInput | SketchfabModelWhereInput[]
    id?: StringFilter<"SketchfabModel"> | string
    modelUid?: StringFilter<"SketchfabModel"> | string
    userId?: StringFilter<"SketchfabModel"> | string
    projectId?: StringFilter<"SketchfabModel"> | string
    fileUrl?: StringFilter<"SketchfabModel"> | string
    attribution?: JsonFilter<"SketchfabModel">
    license?: StringFilter<"SketchfabModel"> | string
    createdAt?: DateTimeFilter<"SketchfabModel"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type SketchfabModelOrderByWithRelationInput = {
    id?: SortOrder
    modelUid?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    fileUrl?: SortOrder
    attribution?: SortOrder
    license?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
  }

  export type SketchfabModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    modelUid?: string
    AND?: SketchfabModelWhereInput | SketchfabModelWhereInput[]
    OR?: SketchfabModelWhereInput[]
    NOT?: SketchfabModelWhereInput | SketchfabModelWhereInput[]
    userId?: StringFilter<"SketchfabModel"> | string
    projectId?: StringFilter<"SketchfabModel"> | string
    fileUrl?: StringFilter<"SketchfabModel"> | string
    attribution?: JsonFilter<"SketchfabModel">
    license?: StringFilter<"SketchfabModel"> | string
    createdAt?: DateTimeFilter<"SketchfabModel"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "modelUid">

  export type SketchfabModelOrderByWithAggregationInput = {
    id?: SortOrder
    modelUid?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    fileUrl?: SortOrder
    attribution?: SortOrder
    license?: SortOrder
    createdAt?: SortOrder
    _count?: SketchfabModelCountOrderByAggregateInput
    _max?: SketchfabModelMaxOrderByAggregateInput
    _min?: SketchfabModelMinOrderByAggregateInput
  }

  export type SketchfabModelScalarWhereWithAggregatesInput = {
    AND?: SketchfabModelScalarWhereWithAggregatesInput | SketchfabModelScalarWhereWithAggregatesInput[]
    OR?: SketchfabModelScalarWhereWithAggregatesInput[]
    NOT?: SketchfabModelScalarWhereWithAggregatesInput | SketchfabModelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SketchfabModel"> | string
    modelUid?: StringWithAggregatesFilter<"SketchfabModel"> | string
    userId?: StringWithAggregatesFilter<"SketchfabModel"> | string
    projectId?: StringWithAggregatesFilter<"SketchfabModel"> | string
    fileUrl?: StringWithAggregatesFilter<"SketchfabModel"> | string
    attribution?: JsonWithAggregatesFilter<"SketchfabModel">
    license?: StringWithAggregatesFilter<"SketchfabModel"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SketchfabModel"> | Date | string
  }

  export type CadBlockWhereInput = {
    AND?: CadBlockWhereInput | CadBlockWhereInput[]
    OR?: CadBlockWhereInput[]
    NOT?: CadBlockWhereInput | CadBlockWhereInput[]
    id?: StringFilter<"CadBlock"> | string
    slug?: StringFilter<"CadBlock"> | string
    name?: StringFilter<"CadBlock"> | string
    category?: StringFilter<"CadBlock"> | string
    subcategory?: StringNullableFilter<"CadBlock"> | string | null
    tags?: StringNullableListFilter<"CadBlock">
    dxfUrl?: StringFilter<"CadBlock"> | string
    thumbnailUrl?: StringFilter<"CadBlock"> | string
    width?: FloatNullableFilter<"CadBlock"> | number | null
    depth?: FloatNullableFilter<"CadBlock"> | number | null
    isPublic?: BoolFilter<"CadBlock"> | boolean
    createdAt?: DateTimeFilter<"CadBlock"> | Date | string
    updatedAt?: DateTimeFilter<"CadBlock"> | Date | string
  }

  export type CadBlockOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subcategory?: SortOrderInput | SortOrder
    tags?: SortOrder
    dxfUrl?: SortOrder
    thumbnailUrl?: SortOrder
    width?: SortOrderInput | SortOrder
    depth?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CadBlockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: CadBlockWhereInput | CadBlockWhereInput[]
    OR?: CadBlockWhereInput[]
    NOT?: CadBlockWhereInput | CadBlockWhereInput[]
    name?: StringFilter<"CadBlock"> | string
    category?: StringFilter<"CadBlock"> | string
    subcategory?: StringNullableFilter<"CadBlock"> | string | null
    tags?: StringNullableListFilter<"CadBlock">
    dxfUrl?: StringFilter<"CadBlock"> | string
    thumbnailUrl?: StringFilter<"CadBlock"> | string
    width?: FloatNullableFilter<"CadBlock"> | number | null
    depth?: FloatNullableFilter<"CadBlock"> | number | null
    isPublic?: BoolFilter<"CadBlock"> | boolean
    createdAt?: DateTimeFilter<"CadBlock"> | Date | string
    updatedAt?: DateTimeFilter<"CadBlock"> | Date | string
  }, "id" | "slug">

  export type CadBlockOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subcategory?: SortOrderInput | SortOrder
    tags?: SortOrder
    dxfUrl?: SortOrder
    thumbnailUrl?: SortOrder
    width?: SortOrderInput | SortOrder
    depth?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CadBlockCountOrderByAggregateInput
    _avg?: CadBlockAvgOrderByAggregateInput
    _max?: CadBlockMaxOrderByAggregateInput
    _min?: CadBlockMinOrderByAggregateInput
    _sum?: CadBlockSumOrderByAggregateInput
  }

  export type CadBlockScalarWhereWithAggregatesInput = {
    AND?: CadBlockScalarWhereWithAggregatesInput | CadBlockScalarWhereWithAggregatesInput[]
    OR?: CadBlockScalarWhereWithAggregatesInput[]
    NOT?: CadBlockScalarWhereWithAggregatesInput | CadBlockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CadBlock"> | string
    slug?: StringWithAggregatesFilter<"CadBlock"> | string
    name?: StringWithAggregatesFilter<"CadBlock"> | string
    category?: StringWithAggregatesFilter<"CadBlock"> | string
    subcategory?: StringNullableWithAggregatesFilter<"CadBlock"> | string | null
    tags?: StringNullableListFilter<"CadBlock">
    dxfUrl?: StringWithAggregatesFilter<"CadBlock"> | string
    thumbnailUrl?: StringWithAggregatesFilter<"CadBlock"> | string
    width?: FloatNullableWithAggregatesFilter<"CadBlock"> | number | null
    depth?: FloatNullableWithAggregatesFilter<"CadBlock"> | number | null
    isPublic?: BoolWithAggregatesFilter<"CadBlock"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CadBlock"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CadBlock"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenUncheckedCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUncheckedUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanCreateNestedManyWithoutProjectInput
    massings?: MassingCreateNestedManyWithoutProjectInput
    models3D?: Model3DCreateNestedManyWithoutProjectInput
    user?: UserCreateNestedOneWithoutProjectsInput
    siteAnalysis?: SiteAnalysisCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedCreateNestedManyWithoutProjectInput
    massings?: MassingUncheckedCreateNestedManyWithoutProjectInput
    models3D?: Model3DUncheckedCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUpdateManyWithoutProjectNestedInput
    massings?: MassingUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUpdateManyWithoutProjectNestedInput
    user?: UserUpdateOneWithoutProjectsNestedInput
    siteAnalysis?: SiteAnalysisUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedUpdateManyWithoutProjectNestedInput
    massings?: MassingUncheckedUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUncheckedUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutSiteAnalysisInput
  }

  export type SiteAnalysisUncheckedCreateInput = {
    id?: string
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutSiteAnalysisNestedInput
  }

  export type SiteAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisCreateManyInput = {
    id?: string
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
  }

  export type FloorplanCreateInput = {
    id?: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutFloorplansInput
    models3D?: Model3DCreateNestedManyWithoutFloorplanInput
  }

  export type FloorplanUncheckedCreateInput = {
    id?: string
    projectId: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
    models3D?: Model3DUncheckedCreateNestedManyWithoutFloorplanInput
  }

  export type FloorplanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutFloorplansNestedInput
    models3D?: Model3DUpdateManyWithoutFloorplanNestedInput
  }

  export type FloorplanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    models3D?: Model3DUncheckedUpdateManyWithoutFloorplanNestedInput
  }

  export type FloorplanCreateManyInput = {
    id?: string
    projectId: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
  }

  export type FloorplanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type FloorplanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type Model3DCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplan?: FloorplanCreateNestedOneWithoutModels3DInput
    project: ProjectCreateNestedOneWithoutModels3DInput
  }

  export type Model3DUncheckedCreateInput = {
    id?: string
    projectId: string
    floorplanId?: string | null
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplan?: FloorplanUpdateOneWithoutModels3DNestedInput
    project?: ProjectUpdateOneRequiredWithoutModels3DNestedInput
  }

  export type Model3DUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    floorplanId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DCreateManyInput = {
    id?: string
    projectId: string
    floorplanId?: string | null
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    floorplanId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    massingData: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutMassingsInput
  }

  export type MassingUncheckedCreateInput = {
    id?: string
    projectId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    massingData: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutMassingsNestedInput
  }

  export type MassingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingCreateManyInput = {
    id?: string
    projectId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    massingData: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileCreateInput = {
    id?: string
    userId: string
    projectId?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    storageUrl: string
    storagePath: string
    path?: string | null
    fileType: string
    category?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileUncheckedCreateInput = {
    id?: string
    userId: string
    projectId?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    storageUrl: string
    storagePath: string
    path?: string | null
    fileType: string
    category?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    storageUrl?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    path?: NullableStringFieldUpdateOperationsInput | string | null
    fileType?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    storageUrl?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    path?: NullableStringFieldUpdateOperationsInput | string | null
    fileType?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileCreateManyInput = {
    id?: string
    userId: string
    projectId?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    storageUrl: string
    storagePath: string
    path?: string | null
    fileType: string
    category?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    storageUrl?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    path?: NullableStringFieldUpdateOperationsInput | string | null
    fileType?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type FileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    storageUrl?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    path?: NullableStringFieldUpdateOperationsInput | string | null
    fileType?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GeospatialCacheCreateInput = {
    id?: string
    cacheKey: string
    data: JsonNullValueInput | InputJsonValue
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type GeospatialCacheUncheckedCreateInput = {
    id?: string
    cacheKey: string
    data: JsonNullValueInput | InputJsonValue
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type GeospatialCacheUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeospatialCacheUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeospatialCacheCreateManyInput = {
    id?: string
    cacheKey: string
    data: JsonNullValueInput | InputJsonValue
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type GeospatialCacheUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeospatialCacheUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabTokenCreateInput = {
    id?: string
    accessToken: string
    refreshToken: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSketchfabTokensInput
  }

  export type SketchfabTokenUncheckedCreateInput = {
    id?: string
    userId: string
    accessToken: string
    refreshToken: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SketchfabTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSketchfabTokensNestedInput
  }

  export type SketchfabTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabTokenCreateManyInput = {
    id?: string
    userId: string
    accessToken: string
    refreshToken: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SketchfabTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabModelCreateInput = {
    id?: string
    modelUid: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSketchfabModelsInput
    project: ProjectCreateNestedOneWithoutSketchfabModelsInput
  }

  export type SketchfabModelUncheckedCreateInput = {
    id?: string
    modelUid: string
    userId: string
    projectId: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
  }

  export type SketchfabModelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSketchfabModelsNestedInput
    project?: ProjectUpdateOneRequiredWithoutSketchfabModelsNestedInput
  }

  export type SketchfabModelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabModelCreateManyInput = {
    id?: string
    modelUid: string
    userId: string
    projectId: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
  }

  export type SketchfabModelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabModelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CadBlockCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    subcategory?: string | null
    tags?: CadBlockCreatetagsInput | string[]
    dxfUrl: string
    thumbnailUrl: string
    width?: number | null
    depth?: number | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CadBlockUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    subcategory?: string | null
    tags?: CadBlockCreatetagsInput | string[]
    dxfUrl: string
    thumbnailUrl: string
    width?: number | null
    depth?: number | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CadBlockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: CadBlockUpdatetagsInput | string[]
    dxfUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    width?: NullableFloatFieldUpdateOperationsInput | number | null
    depth?: NullableFloatFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CadBlockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: CadBlockUpdatetagsInput | string[]
    dxfUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    width?: NullableFloatFieldUpdateOperationsInput | number | null
    depth?: NullableFloatFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CadBlockCreateManyInput = {
    id?: string
    slug: string
    name: string
    category: string
    subcategory?: string | null
    tags?: CadBlockCreatetagsInput | string[]
    dxfUrl: string
    thumbnailUrl: string
    width?: number | null
    depth?: number | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CadBlockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: CadBlockUpdatetagsInput | string[]
    dxfUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    width?: NullableFloatFieldUpdateOperationsInput | number | null
    depth?: NullableFloatFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CadBlockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: CadBlockUpdatetagsInput | string[]
    dxfUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    width?: NullableFloatFieldUpdateOperationsInput | number | null
    depth?: NullableFloatFieldUpdateOperationsInput | number | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type SketchfabTokenListRelationFilter = {
    every?: SketchfabTokenWhereInput
    some?: SketchfabTokenWhereInput
    none?: SketchfabTokenWhereInput
  }

  export type SketchfabModelListRelationFilter = {
    every?: SketchfabModelWhereInput
    some?: SketchfabModelWhereInput
    none?: SketchfabModelWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SketchfabTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SketchfabModelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FloorplanListRelationFilter = {
    every?: FloorplanWhereInput
    some?: FloorplanWhereInput
    none?: FloorplanWhereInput
  }

  export type MassingListRelationFilter = {
    every?: MassingWhereInput
    some?: MassingWhereInput
    none?: MassingWhereInput
  }

  export type Model3DListRelationFilter = {
    every?: Model3DWhereInput
    some?: Model3DWhereInput
    none?: Model3DWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SiteAnalysisNullableScalarRelationFilter = {
    is?: SiteAnalysisWhereInput | null
    isNot?: SiteAnalysisWhereInput | null
  }

  export type FloorplanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MassingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type Model3DOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    settings?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type SiteAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sunPathData?: SortOrder
    weatherData?: SortOrder
    topographyData?: SortOrder
    contextData?: SortOrder
    analysisResults?: SortOrder
    boundary?: SortOrder
    coordinates?: SortOrder
  }

  export type SiteAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloorplanCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
  }

  export type FloorplanAvgOrderByAggregateInput = {
    level?: SortOrder
  }

  export type FloorplanMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloorplanMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloorplanSumOrderByAggregateInput = {
    level?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloorplanNullableScalarRelationFilter = {
    is?: FloorplanWhereInput | null
    isNot?: FloorplanWhereInput | null
  }

  export type Model3DCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    floorplanId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modelData?: SortOrder
    settings?: SortOrder
  }

  export type Model3DMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    floorplanId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type Model3DMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    floorplanId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MassingCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    massingData?: SortOrder
    analysis?: SortOrder
  }

  export type MassingMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MassingMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    storageUrl?: SortOrder
    storagePath?: SortOrder
    path?: SortOrder
    fileType?: SortOrder
    category?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
    metadata?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    storageUrl?: SortOrder
    storagePath?: SortOrder
    path?: SortOrder
    fileType?: SortOrder
    category?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    storageUrl?: SortOrder
    storagePath?: SortOrder
    path?: SortOrder
    fileType?: SortOrder
    category?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type GeospatialCacheCountOrderByAggregateInput = {
    id?: SortOrder
    cacheKey?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GeospatialCacheMaxOrderByAggregateInput = {
    id?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GeospatialCacheMinOrderByAggregateInput = {
    id?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SketchfabTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SketchfabTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SketchfabTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SketchfabModelCountOrderByAggregateInput = {
    id?: SortOrder
    modelUid?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    fileUrl?: SortOrder
    attribution?: SortOrder
    license?: SortOrder
    createdAt?: SortOrder
  }

  export type SketchfabModelMaxOrderByAggregateInput = {
    id?: SortOrder
    modelUid?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    fileUrl?: SortOrder
    license?: SortOrder
    createdAt?: SortOrder
  }

  export type SketchfabModelMinOrderByAggregateInput = {
    id?: SortOrder
    modelUid?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    fileUrl?: SortOrder
    license?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CadBlockCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    tags?: SortOrder
    dxfUrl?: SortOrder
    thumbnailUrl?: SortOrder
    width?: SortOrder
    depth?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CadBlockAvgOrderByAggregateInput = {
    width?: SortOrder
    depth?: SortOrder
  }

  export type CadBlockMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    dxfUrl?: SortOrder
    thumbnailUrl?: SortOrder
    width?: SortOrder
    depth?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CadBlockMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    dxfUrl?: SortOrder
    thumbnailUrl?: SortOrder
    width?: SortOrder
    depth?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CadBlockSumOrderByAggregateInput = {
    width?: SortOrder
    depth?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProjectCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type SketchfabTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<SketchfabTokenCreateWithoutUserInput, SketchfabTokenUncheckedCreateWithoutUserInput> | SketchfabTokenCreateWithoutUserInput[] | SketchfabTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabTokenCreateOrConnectWithoutUserInput | SketchfabTokenCreateOrConnectWithoutUserInput[]
    createMany?: SketchfabTokenCreateManyUserInputEnvelope
    connect?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
  }

  export type SketchfabModelCreateNestedManyWithoutUserInput = {
    create?: XOR<SketchfabModelCreateWithoutUserInput, SketchfabModelUncheckedCreateWithoutUserInput> | SketchfabModelCreateWithoutUserInput[] | SketchfabModelUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutUserInput | SketchfabModelCreateOrConnectWithoutUserInput[]
    createMany?: SketchfabModelCreateManyUserInputEnvelope
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type SketchfabTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SketchfabTokenCreateWithoutUserInput, SketchfabTokenUncheckedCreateWithoutUserInput> | SketchfabTokenCreateWithoutUserInput[] | SketchfabTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabTokenCreateOrConnectWithoutUserInput | SketchfabTokenCreateOrConnectWithoutUserInput[]
    createMany?: SketchfabTokenCreateManyUserInputEnvelope
    connect?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
  }

  export type SketchfabModelUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SketchfabModelCreateWithoutUserInput, SketchfabModelUncheckedCreateWithoutUserInput> | SketchfabModelCreateWithoutUserInput[] | SketchfabModelUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutUserInput | SketchfabModelCreateOrConnectWithoutUserInput[]
    createMany?: SketchfabModelCreateManyUserInputEnvelope
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type SketchfabTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<SketchfabTokenCreateWithoutUserInput, SketchfabTokenUncheckedCreateWithoutUserInput> | SketchfabTokenCreateWithoutUserInput[] | SketchfabTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabTokenCreateOrConnectWithoutUserInput | SketchfabTokenCreateOrConnectWithoutUserInput[]
    upsert?: SketchfabTokenUpsertWithWhereUniqueWithoutUserInput | SketchfabTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SketchfabTokenCreateManyUserInputEnvelope
    set?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    disconnect?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    delete?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    connect?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    update?: SketchfabTokenUpdateWithWhereUniqueWithoutUserInput | SketchfabTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SketchfabTokenUpdateManyWithWhereWithoutUserInput | SketchfabTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SketchfabTokenScalarWhereInput | SketchfabTokenScalarWhereInput[]
  }

  export type SketchfabModelUpdateManyWithoutUserNestedInput = {
    create?: XOR<SketchfabModelCreateWithoutUserInput, SketchfabModelUncheckedCreateWithoutUserInput> | SketchfabModelCreateWithoutUserInput[] | SketchfabModelUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutUserInput | SketchfabModelCreateOrConnectWithoutUserInput[]
    upsert?: SketchfabModelUpsertWithWhereUniqueWithoutUserInput | SketchfabModelUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SketchfabModelCreateManyUserInputEnvelope
    set?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    disconnect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    delete?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    update?: SketchfabModelUpdateWithWhereUniqueWithoutUserInput | SketchfabModelUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SketchfabModelUpdateManyWithWhereWithoutUserInput | SketchfabModelUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SketchfabModelScalarWhereInput | SketchfabModelScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type SketchfabTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SketchfabTokenCreateWithoutUserInput, SketchfabTokenUncheckedCreateWithoutUserInput> | SketchfabTokenCreateWithoutUserInput[] | SketchfabTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabTokenCreateOrConnectWithoutUserInput | SketchfabTokenCreateOrConnectWithoutUserInput[]
    upsert?: SketchfabTokenUpsertWithWhereUniqueWithoutUserInput | SketchfabTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SketchfabTokenCreateManyUserInputEnvelope
    set?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    disconnect?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    delete?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    connect?: SketchfabTokenWhereUniqueInput | SketchfabTokenWhereUniqueInput[]
    update?: SketchfabTokenUpdateWithWhereUniqueWithoutUserInput | SketchfabTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SketchfabTokenUpdateManyWithWhereWithoutUserInput | SketchfabTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SketchfabTokenScalarWhereInput | SketchfabTokenScalarWhereInput[]
  }

  export type SketchfabModelUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SketchfabModelCreateWithoutUserInput, SketchfabModelUncheckedCreateWithoutUserInput> | SketchfabModelCreateWithoutUserInput[] | SketchfabModelUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutUserInput | SketchfabModelCreateOrConnectWithoutUserInput[]
    upsert?: SketchfabModelUpsertWithWhereUniqueWithoutUserInput | SketchfabModelUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SketchfabModelCreateManyUserInputEnvelope
    set?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    disconnect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    delete?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    update?: SketchfabModelUpdateWithWhereUniqueWithoutUserInput | SketchfabModelUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SketchfabModelUpdateManyWithWhereWithoutUserInput | SketchfabModelUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SketchfabModelScalarWhereInput | SketchfabModelScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type FloorplanCreateNestedManyWithoutProjectInput = {
    create?: XOR<FloorplanCreateWithoutProjectInput, FloorplanUncheckedCreateWithoutProjectInput> | FloorplanCreateWithoutProjectInput[] | FloorplanUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FloorplanCreateOrConnectWithoutProjectInput | FloorplanCreateOrConnectWithoutProjectInput[]
    createMany?: FloorplanCreateManyProjectInputEnvelope
    connect?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
  }

  export type MassingCreateNestedManyWithoutProjectInput = {
    create?: XOR<MassingCreateWithoutProjectInput, MassingUncheckedCreateWithoutProjectInput> | MassingCreateWithoutProjectInput[] | MassingUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MassingCreateOrConnectWithoutProjectInput | MassingCreateOrConnectWithoutProjectInput[]
    createMany?: MassingCreateManyProjectInputEnvelope
    connect?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
  }

  export type Model3DCreateNestedManyWithoutProjectInput = {
    create?: XOR<Model3DCreateWithoutProjectInput, Model3DUncheckedCreateWithoutProjectInput> | Model3DCreateWithoutProjectInput[] | Model3DUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutProjectInput | Model3DCreateOrConnectWithoutProjectInput[]
    createMany?: Model3DCreateManyProjectInputEnvelope
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type SiteAnalysisCreateNestedOneWithoutProjectInput = {
    create?: XOR<SiteAnalysisCreateWithoutProjectInput, SiteAnalysisUncheckedCreateWithoutProjectInput>
    connectOrCreate?: SiteAnalysisCreateOrConnectWithoutProjectInput
    connect?: SiteAnalysisWhereUniqueInput
  }

  export type SketchfabModelCreateNestedManyWithoutProjectInput = {
    create?: XOR<SketchfabModelCreateWithoutProjectInput, SketchfabModelUncheckedCreateWithoutProjectInput> | SketchfabModelCreateWithoutProjectInput[] | SketchfabModelUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutProjectInput | SketchfabModelCreateOrConnectWithoutProjectInput[]
    createMany?: SketchfabModelCreateManyProjectInputEnvelope
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
  }

  export type FloorplanUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<FloorplanCreateWithoutProjectInput, FloorplanUncheckedCreateWithoutProjectInput> | FloorplanCreateWithoutProjectInput[] | FloorplanUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FloorplanCreateOrConnectWithoutProjectInput | FloorplanCreateOrConnectWithoutProjectInput[]
    createMany?: FloorplanCreateManyProjectInputEnvelope
    connect?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
  }

  export type MassingUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<MassingCreateWithoutProjectInput, MassingUncheckedCreateWithoutProjectInput> | MassingCreateWithoutProjectInput[] | MassingUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MassingCreateOrConnectWithoutProjectInput | MassingCreateOrConnectWithoutProjectInput[]
    createMany?: MassingCreateManyProjectInputEnvelope
    connect?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
  }

  export type Model3DUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<Model3DCreateWithoutProjectInput, Model3DUncheckedCreateWithoutProjectInput> | Model3DCreateWithoutProjectInput[] | Model3DUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutProjectInput | Model3DCreateOrConnectWithoutProjectInput[]
    createMany?: Model3DCreateManyProjectInputEnvelope
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
  }

  export type SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput = {
    create?: XOR<SiteAnalysisCreateWithoutProjectInput, SiteAnalysisUncheckedCreateWithoutProjectInput>
    connectOrCreate?: SiteAnalysisCreateOrConnectWithoutProjectInput
    connect?: SiteAnalysisWhereUniqueInput
  }

  export type SketchfabModelUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<SketchfabModelCreateWithoutProjectInput, SketchfabModelUncheckedCreateWithoutProjectInput> | SketchfabModelCreateWithoutProjectInput[] | SketchfabModelUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutProjectInput | SketchfabModelCreateOrConnectWithoutProjectInput[]
    createMany?: SketchfabModelCreateManyProjectInputEnvelope
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
  }

  export type FloorplanUpdateManyWithoutProjectNestedInput = {
    create?: XOR<FloorplanCreateWithoutProjectInput, FloorplanUncheckedCreateWithoutProjectInput> | FloorplanCreateWithoutProjectInput[] | FloorplanUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FloorplanCreateOrConnectWithoutProjectInput | FloorplanCreateOrConnectWithoutProjectInput[]
    upsert?: FloorplanUpsertWithWhereUniqueWithoutProjectInput | FloorplanUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: FloorplanCreateManyProjectInputEnvelope
    set?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    disconnect?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    delete?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    connect?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    update?: FloorplanUpdateWithWhereUniqueWithoutProjectInput | FloorplanUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: FloorplanUpdateManyWithWhereWithoutProjectInput | FloorplanUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: FloorplanScalarWhereInput | FloorplanScalarWhereInput[]
  }

  export type MassingUpdateManyWithoutProjectNestedInput = {
    create?: XOR<MassingCreateWithoutProjectInput, MassingUncheckedCreateWithoutProjectInput> | MassingCreateWithoutProjectInput[] | MassingUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MassingCreateOrConnectWithoutProjectInput | MassingCreateOrConnectWithoutProjectInput[]
    upsert?: MassingUpsertWithWhereUniqueWithoutProjectInput | MassingUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: MassingCreateManyProjectInputEnvelope
    set?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    disconnect?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    delete?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    connect?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    update?: MassingUpdateWithWhereUniqueWithoutProjectInput | MassingUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: MassingUpdateManyWithWhereWithoutProjectInput | MassingUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: MassingScalarWhereInput | MassingScalarWhereInput[]
  }

  export type Model3DUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Model3DCreateWithoutProjectInput, Model3DUncheckedCreateWithoutProjectInput> | Model3DCreateWithoutProjectInput[] | Model3DUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutProjectInput | Model3DCreateOrConnectWithoutProjectInput[]
    upsert?: Model3DUpsertWithWhereUniqueWithoutProjectInput | Model3DUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: Model3DCreateManyProjectInputEnvelope
    set?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    disconnect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    delete?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    update?: Model3DUpdateWithWhereUniqueWithoutProjectInput | Model3DUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: Model3DUpdateManyWithWhereWithoutProjectInput | Model3DUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: Model3DScalarWhereInput | Model3DScalarWhereInput[]
  }

  export type UserUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type SiteAnalysisUpdateOneWithoutProjectNestedInput = {
    create?: XOR<SiteAnalysisCreateWithoutProjectInput, SiteAnalysisUncheckedCreateWithoutProjectInput>
    connectOrCreate?: SiteAnalysisCreateOrConnectWithoutProjectInput
    upsert?: SiteAnalysisUpsertWithoutProjectInput
    disconnect?: SiteAnalysisWhereInput | boolean
    delete?: SiteAnalysisWhereInput | boolean
    connect?: SiteAnalysisWhereUniqueInput
    update?: XOR<XOR<SiteAnalysisUpdateToOneWithWhereWithoutProjectInput, SiteAnalysisUpdateWithoutProjectInput>, SiteAnalysisUncheckedUpdateWithoutProjectInput>
  }

  export type SketchfabModelUpdateManyWithoutProjectNestedInput = {
    create?: XOR<SketchfabModelCreateWithoutProjectInput, SketchfabModelUncheckedCreateWithoutProjectInput> | SketchfabModelCreateWithoutProjectInput[] | SketchfabModelUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutProjectInput | SketchfabModelCreateOrConnectWithoutProjectInput[]
    upsert?: SketchfabModelUpsertWithWhereUniqueWithoutProjectInput | SketchfabModelUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: SketchfabModelCreateManyProjectInputEnvelope
    set?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    disconnect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    delete?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    update?: SketchfabModelUpdateWithWhereUniqueWithoutProjectInput | SketchfabModelUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: SketchfabModelUpdateManyWithWhereWithoutProjectInput | SketchfabModelUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: SketchfabModelScalarWhereInput | SketchfabModelScalarWhereInput[]
  }

  export type FloorplanUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<FloorplanCreateWithoutProjectInput, FloorplanUncheckedCreateWithoutProjectInput> | FloorplanCreateWithoutProjectInput[] | FloorplanUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: FloorplanCreateOrConnectWithoutProjectInput | FloorplanCreateOrConnectWithoutProjectInput[]
    upsert?: FloorplanUpsertWithWhereUniqueWithoutProjectInput | FloorplanUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: FloorplanCreateManyProjectInputEnvelope
    set?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    disconnect?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    delete?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    connect?: FloorplanWhereUniqueInput | FloorplanWhereUniqueInput[]
    update?: FloorplanUpdateWithWhereUniqueWithoutProjectInput | FloorplanUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: FloorplanUpdateManyWithWhereWithoutProjectInput | FloorplanUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: FloorplanScalarWhereInput | FloorplanScalarWhereInput[]
  }

  export type MassingUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<MassingCreateWithoutProjectInput, MassingUncheckedCreateWithoutProjectInput> | MassingCreateWithoutProjectInput[] | MassingUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MassingCreateOrConnectWithoutProjectInput | MassingCreateOrConnectWithoutProjectInput[]
    upsert?: MassingUpsertWithWhereUniqueWithoutProjectInput | MassingUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: MassingCreateManyProjectInputEnvelope
    set?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    disconnect?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    delete?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    connect?: MassingWhereUniqueInput | MassingWhereUniqueInput[]
    update?: MassingUpdateWithWhereUniqueWithoutProjectInput | MassingUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: MassingUpdateManyWithWhereWithoutProjectInput | MassingUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: MassingScalarWhereInput | MassingScalarWhereInput[]
  }

  export type Model3DUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<Model3DCreateWithoutProjectInput, Model3DUncheckedCreateWithoutProjectInput> | Model3DCreateWithoutProjectInput[] | Model3DUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutProjectInput | Model3DCreateOrConnectWithoutProjectInput[]
    upsert?: Model3DUpsertWithWhereUniqueWithoutProjectInput | Model3DUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: Model3DCreateManyProjectInputEnvelope
    set?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    disconnect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    delete?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    update?: Model3DUpdateWithWhereUniqueWithoutProjectInput | Model3DUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: Model3DUpdateManyWithWhereWithoutProjectInput | Model3DUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: Model3DScalarWhereInput | Model3DScalarWhereInput[]
  }

  export type SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput = {
    create?: XOR<SiteAnalysisCreateWithoutProjectInput, SiteAnalysisUncheckedCreateWithoutProjectInput>
    connectOrCreate?: SiteAnalysisCreateOrConnectWithoutProjectInput
    upsert?: SiteAnalysisUpsertWithoutProjectInput
    disconnect?: SiteAnalysisWhereInput | boolean
    delete?: SiteAnalysisWhereInput | boolean
    connect?: SiteAnalysisWhereUniqueInput
    update?: XOR<XOR<SiteAnalysisUpdateToOneWithWhereWithoutProjectInput, SiteAnalysisUpdateWithoutProjectInput>, SiteAnalysisUncheckedUpdateWithoutProjectInput>
  }

  export type SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<SketchfabModelCreateWithoutProjectInput, SketchfabModelUncheckedCreateWithoutProjectInput> | SketchfabModelCreateWithoutProjectInput[] | SketchfabModelUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SketchfabModelCreateOrConnectWithoutProjectInput | SketchfabModelCreateOrConnectWithoutProjectInput[]
    upsert?: SketchfabModelUpsertWithWhereUniqueWithoutProjectInput | SketchfabModelUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: SketchfabModelCreateManyProjectInputEnvelope
    set?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    disconnect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    delete?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    connect?: SketchfabModelWhereUniqueInput | SketchfabModelWhereUniqueInput[]
    update?: SketchfabModelUpdateWithWhereUniqueWithoutProjectInput | SketchfabModelUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: SketchfabModelUpdateManyWithWhereWithoutProjectInput | SketchfabModelUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: SketchfabModelScalarWhereInput | SketchfabModelScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutSiteAnalysisInput = {
    create?: XOR<ProjectCreateWithoutSiteAnalysisInput, ProjectUncheckedCreateWithoutSiteAnalysisInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSiteAnalysisInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutSiteAnalysisNestedInput = {
    create?: XOR<ProjectCreateWithoutSiteAnalysisInput, ProjectUncheckedCreateWithoutSiteAnalysisInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSiteAnalysisInput
    upsert?: ProjectUpsertWithoutSiteAnalysisInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutSiteAnalysisInput, ProjectUpdateWithoutSiteAnalysisInput>, ProjectUncheckedUpdateWithoutSiteAnalysisInput>
  }

  export type ProjectCreateNestedOneWithoutFloorplansInput = {
    create?: XOR<ProjectCreateWithoutFloorplansInput, ProjectUncheckedCreateWithoutFloorplansInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFloorplansInput
    connect?: ProjectWhereUniqueInput
  }

  export type Model3DCreateNestedManyWithoutFloorplanInput = {
    create?: XOR<Model3DCreateWithoutFloorplanInput, Model3DUncheckedCreateWithoutFloorplanInput> | Model3DCreateWithoutFloorplanInput[] | Model3DUncheckedCreateWithoutFloorplanInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutFloorplanInput | Model3DCreateOrConnectWithoutFloorplanInput[]
    createMany?: Model3DCreateManyFloorplanInputEnvelope
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
  }

  export type Model3DUncheckedCreateNestedManyWithoutFloorplanInput = {
    create?: XOR<Model3DCreateWithoutFloorplanInput, Model3DUncheckedCreateWithoutFloorplanInput> | Model3DCreateWithoutFloorplanInput[] | Model3DUncheckedCreateWithoutFloorplanInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutFloorplanInput | Model3DCreateOrConnectWithoutFloorplanInput[]
    createMany?: Model3DCreateManyFloorplanInputEnvelope
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutFloorplansNestedInput = {
    create?: XOR<ProjectCreateWithoutFloorplansInput, ProjectUncheckedCreateWithoutFloorplansInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFloorplansInput
    upsert?: ProjectUpsertWithoutFloorplansInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFloorplansInput, ProjectUpdateWithoutFloorplansInput>, ProjectUncheckedUpdateWithoutFloorplansInput>
  }

  export type Model3DUpdateManyWithoutFloorplanNestedInput = {
    create?: XOR<Model3DCreateWithoutFloorplanInput, Model3DUncheckedCreateWithoutFloorplanInput> | Model3DCreateWithoutFloorplanInput[] | Model3DUncheckedCreateWithoutFloorplanInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutFloorplanInput | Model3DCreateOrConnectWithoutFloorplanInput[]
    upsert?: Model3DUpsertWithWhereUniqueWithoutFloorplanInput | Model3DUpsertWithWhereUniqueWithoutFloorplanInput[]
    createMany?: Model3DCreateManyFloorplanInputEnvelope
    set?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    disconnect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    delete?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    update?: Model3DUpdateWithWhereUniqueWithoutFloorplanInput | Model3DUpdateWithWhereUniqueWithoutFloorplanInput[]
    updateMany?: Model3DUpdateManyWithWhereWithoutFloorplanInput | Model3DUpdateManyWithWhereWithoutFloorplanInput[]
    deleteMany?: Model3DScalarWhereInput | Model3DScalarWhereInput[]
  }

  export type Model3DUncheckedUpdateManyWithoutFloorplanNestedInput = {
    create?: XOR<Model3DCreateWithoutFloorplanInput, Model3DUncheckedCreateWithoutFloorplanInput> | Model3DCreateWithoutFloorplanInput[] | Model3DUncheckedCreateWithoutFloorplanInput[]
    connectOrCreate?: Model3DCreateOrConnectWithoutFloorplanInput | Model3DCreateOrConnectWithoutFloorplanInput[]
    upsert?: Model3DUpsertWithWhereUniqueWithoutFloorplanInput | Model3DUpsertWithWhereUniqueWithoutFloorplanInput[]
    createMany?: Model3DCreateManyFloorplanInputEnvelope
    set?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    disconnect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    delete?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    connect?: Model3DWhereUniqueInput | Model3DWhereUniqueInput[]
    update?: Model3DUpdateWithWhereUniqueWithoutFloorplanInput | Model3DUpdateWithWhereUniqueWithoutFloorplanInput[]
    updateMany?: Model3DUpdateManyWithWhereWithoutFloorplanInput | Model3DUpdateManyWithWhereWithoutFloorplanInput[]
    deleteMany?: Model3DScalarWhereInput | Model3DScalarWhereInput[]
  }

  export type FloorplanCreateNestedOneWithoutModels3DInput = {
    create?: XOR<FloorplanCreateWithoutModels3DInput, FloorplanUncheckedCreateWithoutModels3DInput>
    connectOrCreate?: FloorplanCreateOrConnectWithoutModels3DInput
    connect?: FloorplanWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutModels3DInput = {
    create?: XOR<ProjectCreateWithoutModels3DInput, ProjectUncheckedCreateWithoutModels3DInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutModels3DInput
    connect?: ProjectWhereUniqueInput
  }

  export type FloorplanUpdateOneWithoutModels3DNestedInput = {
    create?: XOR<FloorplanCreateWithoutModels3DInput, FloorplanUncheckedCreateWithoutModels3DInput>
    connectOrCreate?: FloorplanCreateOrConnectWithoutModels3DInput
    upsert?: FloorplanUpsertWithoutModels3DInput
    disconnect?: FloorplanWhereInput | boolean
    delete?: FloorplanWhereInput | boolean
    connect?: FloorplanWhereUniqueInput
    update?: XOR<XOR<FloorplanUpdateToOneWithWhereWithoutModels3DInput, FloorplanUpdateWithoutModels3DInput>, FloorplanUncheckedUpdateWithoutModels3DInput>
  }

  export type ProjectUpdateOneRequiredWithoutModels3DNestedInput = {
    create?: XOR<ProjectCreateWithoutModels3DInput, ProjectUncheckedCreateWithoutModels3DInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutModels3DInput
    upsert?: ProjectUpsertWithoutModels3DInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutModels3DInput, ProjectUpdateWithoutModels3DInput>, ProjectUncheckedUpdateWithoutModels3DInput>
  }

  export type ProjectCreateNestedOneWithoutMassingsInput = {
    create?: XOR<ProjectCreateWithoutMassingsInput, ProjectUncheckedCreateWithoutMassingsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMassingsInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutMassingsNestedInput = {
    create?: XOR<ProjectCreateWithoutMassingsInput, ProjectUncheckedCreateWithoutMassingsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMassingsInput
    upsert?: ProjectUpsertWithoutMassingsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutMassingsInput, ProjectUpdateWithoutMassingsInput>, ProjectUncheckedUpdateWithoutMassingsInput>
  }

  export type UserCreateNestedOneWithoutSketchfabTokensInput = {
    create?: XOR<UserCreateWithoutSketchfabTokensInput, UserUncheckedCreateWithoutSketchfabTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutSketchfabTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSketchfabTokensNestedInput = {
    create?: XOR<UserCreateWithoutSketchfabTokensInput, UserUncheckedCreateWithoutSketchfabTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutSketchfabTokensInput
    upsert?: UserUpsertWithoutSketchfabTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSketchfabTokensInput, UserUpdateWithoutSketchfabTokensInput>, UserUncheckedUpdateWithoutSketchfabTokensInput>
  }

  export type UserCreateNestedOneWithoutSketchfabModelsInput = {
    create?: XOR<UserCreateWithoutSketchfabModelsInput, UserUncheckedCreateWithoutSketchfabModelsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSketchfabModelsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutSketchfabModelsInput = {
    create?: XOR<ProjectCreateWithoutSketchfabModelsInput, ProjectUncheckedCreateWithoutSketchfabModelsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSketchfabModelsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSketchfabModelsNestedInput = {
    create?: XOR<UserCreateWithoutSketchfabModelsInput, UserUncheckedCreateWithoutSketchfabModelsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSketchfabModelsInput
    upsert?: UserUpsertWithoutSketchfabModelsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSketchfabModelsInput, UserUpdateWithoutSketchfabModelsInput>, UserUncheckedUpdateWithoutSketchfabModelsInput>
  }

  export type ProjectUpdateOneRequiredWithoutSketchfabModelsNestedInput = {
    create?: XOR<ProjectCreateWithoutSketchfabModelsInput, ProjectUncheckedCreateWithoutSketchfabModelsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSketchfabModelsInput
    upsert?: ProjectUpsertWithoutSketchfabModelsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutSketchfabModelsInput, ProjectUpdateWithoutSketchfabModelsInput>, ProjectUncheckedUpdateWithoutSketchfabModelsInput>
  }

  export type CadBlockCreatetagsInput = {
    set: string[]
  }

  export type CadBlockUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanCreateNestedManyWithoutProjectInput
    massings?: MassingCreateNestedManyWithoutProjectInput
    models3D?: Model3DCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedCreateNestedManyWithoutProjectInput
    massings?: MassingUncheckedCreateNestedManyWithoutProjectInput
    models3D?: Model3DUncheckedCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutUserInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectCreateManyUserInputEnvelope = {
    data: ProjectCreateManyUserInput | ProjectCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SketchfabTokenCreateWithoutUserInput = {
    id?: string
    accessToken: string
    refreshToken: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SketchfabTokenUncheckedCreateWithoutUserInput = {
    id?: string
    accessToken: string
    refreshToken: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SketchfabTokenCreateOrConnectWithoutUserInput = {
    where: SketchfabTokenWhereUniqueInput
    create: XOR<SketchfabTokenCreateWithoutUserInput, SketchfabTokenUncheckedCreateWithoutUserInput>
  }

  export type SketchfabTokenCreateManyUserInputEnvelope = {
    data: SketchfabTokenCreateManyUserInput | SketchfabTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SketchfabModelCreateWithoutUserInput = {
    id?: string
    modelUid: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutSketchfabModelsInput
  }

  export type SketchfabModelUncheckedCreateWithoutUserInput = {
    id?: string
    modelUid: string
    projectId: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
  }

  export type SketchfabModelCreateOrConnectWithoutUserInput = {
    where: SketchfabModelWhereUniqueInput
    create: XOR<SketchfabModelCreateWithoutUserInput, SketchfabModelUncheckedCreateWithoutUserInput>
  }

  export type SketchfabModelCreateManyUserInputEnvelope = {
    data: SketchfabModelCreateManyUserInput | SketchfabModelCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
  }

  export type ProjectUpdateManyWithWhereWithoutUserInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    userId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    settings?: JsonNullableFilter<"Project">
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    token?: StringFilter<"UserSession"> | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
  }

  export type SketchfabTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: SketchfabTokenWhereUniqueInput
    update: XOR<SketchfabTokenUpdateWithoutUserInput, SketchfabTokenUncheckedUpdateWithoutUserInput>
    create: XOR<SketchfabTokenCreateWithoutUserInput, SketchfabTokenUncheckedCreateWithoutUserInput>
  }

  export type SketchfabTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: SketchfabTokenWhereUniqueInput
    data: XOR<SketchfabTokenUpdateWithoutUserInput, SketchfabTokenUncheckedUpdateWithoutUserInput>
  }

  export type SketchfabTokenUpdateManyWithWhereWithoutUserInput = {
    where: SketchfabTokenScalarWhereInput
    data: XOR<SketchfabTokenUpdateManyMutationInput, SketchfabTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type SketchfabTokenScalarWhereInput = {
    AND?: SketchfabTokenScalarWhereInput | SketchfabTokenScalarWhereInput[]
    OR?: SketchfabTokenScalarWhereInput[]
    NOT?: SketchfabTokenScalarWhereInput | SketchfabTokenScalarWhereInput[]
    id?: StringFilter<"SketchfabToken"> | string
    userId?: StringFilter<"SketchfabToken"> | string
    accessToken?: StringFilter<"SketchfabToken"> | string
    refreshToken?: StringFilter<"SketchfabToken"> | string
    expiresAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    createdAt?: DateTimeFilter<"SketchfabToken"> | Date | string
    updatedAt?: DateTimeFilter<"SketchfabToken"> | Date | string
  }

  export type SketchfabModelUpsertWithWhereUniqueWithoutUserInput = {
    where: SketchfabModelWhereUniqueInput
    update: XOR<SketchfabModelUpdateWithoutUserInput, SketchfabModelUncheckedUpdateWithoutUserInput>
    create: XOR<SketchfabModelCreateWithoutUserInput, SketchfabModelUncheckedCreateWithoutUserInput>
  }

  export type SketchfabModelUpdateWithWhereUniqueWithoutUserInput = {
    where: SketchfabModelWhereUniqueInput
    data: XOR<SketchfabModelUpdateWithoutUserInput, SketchfabModelUncheckedUpdateWithoutUserInput>
  }

  export type SketchfabModelUpdateManyWithWhereWithoutUserInput = {
    where: SketchfabModelScalarWhereInput
    data: XOR<SketchfabModelUpdateManyMutationInput, SketchfabModelUncheckedUpdateManyWithoutUserInput>
  }

  export type SketchfabModelScalarWhereInput = {
    AND?: SketchfabModelScalarWhereInput | SketchfabModelScalarWhereInput[]
    OR?: SketchfabModelScalarWhereInput[]
    NOT?: SketchfabModelScalarWhereInput | SketchfabModelScalarWhereInput[]
    id?: StringFilter<"SketchfabModel"> | string
    modelUid?: StringFilter<"SketchfabModel"> | string
    userId?: StringFilter<"SketchfabModel"> | string
    projectId?: StringFilter<"SketchfabModel"> | string
    fileUrl?: StringFilter<"SketchfabModel"> | string
    attribution?: JsonFilter<"SketchfabModel">
    license?: StringFilter<"SketchfabModel"> | string
    createdAt?: DateTimeFilter<"SketchfabModel"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenUncheckedCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUncheckedUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FloorplanCreateWithoutProjectInput = {
    id?: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
    models3D?: Model3DCreateNestedManyWithoutFloorplanInput
  }

  export type FloorplanUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
    models3D?: Model3DUncheckedCreateNestedManyWithoutFloorplanInput
  }

  export type FloorplanCreateOrConnectWithoutProjectInput = {
    where: FloorplanWhereUniqueInput
    create: XOR<FloorplanCreateWithoutProjectInput, FloorplanUncheckedCreateWithoutProjectInput>
  }

  export type FloorplanCreateManyProjectInputEnvelope = {
    data: FloorplanCreateManyProjectInput | FloorplanCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type MassingCreateWithoutProjectInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    massingData: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    massingData: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingCreateOrConnectWithoutProjectInput = {
    where: MassingWhereUniqueInput
    create: XOR<MassingCreateWithoutProjectInput, MassingUncheckedCreateWithoutProjectInput>
  }

  export type MassingCreateManyProjectInputEnvelope = {
    data: MassingCreateManyProjectInput | MassingCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type Model3DCreateWithoutProjectInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplan?: FloorplanCreateNestedOneWithoutModels3DInput
  }

  export type Model3DUncheckedCreateWithoutProjectInput = {
    id?: string
    floorplanId?: string | null
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DCreateOrConnectWithoutProjectInput = {
    where: Model3DWhereUniqueInput
    create: XOR<Model3DCreateWithoutProjectInput, Model3DUncheckedCreateWithoutProjectInput>
  }

  export type Model3DCreateManyProjectInputEnvelope = {
    data: Model3DCreateManyProjectInput | Model3DCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutProjectsInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenUncheckedCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type SiteAnalysisCreateWithoutProjectInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisUncheckedCreateWithoutProjectInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisCreateOrConnectWithoutProjectInput = {
    where: SiteAnalysisWhereUniqueInput
    create: XOR<SiteAnalysisCreateWithoutProjectInput, SiteAnalysisUncheckedCreateWithoutProjectInput>
  }

  export type SketchfabModelCreateWithoutProjectInput = {
    id?: string
    modelUid: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSketchfabModelsInput
  }

  export type SketchfabModelUncheckedCreateWithoutProjectInput = {
    id?: string
    modelUid: string
    userId: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
  }

  export type SketchfabModelCreateOrConnectWithoutProjectInput = {
    where: SketchfabModelWhereUniqueInput
    create: XOR<SketchfabModelCreateWithoutProjectInput, SketchfabModelUncheckedCreateWithoutProjectInput>
  }

  export type SketchfabModelCreateManyProjectInputEnvelope = {
    data: SketchfabModelCreateManyProjectInput | SketchfabModelCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type FloorplanUpsertWithWhereUniqueWithoutProjectInput = {
    where: FloorplanWhereUniqueInput
    update: XOR<FloorplanUpdateWithoutProjectInput, FloorplanUncheckedUpdateWithoutProjectInput>
    create: XOR<FloorplanCreateWithoutProjectInput, FloorplanUncheckedCreateWithoutProjectInput>
  }

  export type FloorplanUpdateWithWhereUniqueWithoutProjectInput = {
    where: FloorplanWhereUniqueInput
    data: XOR<FloorplanUpdateWithoutProjectInput, FloorplanUncheckedUpdateWithoutProjectInput>
  }

  export type FloorplanUpdateManyWithWhereWithoutProjectInput = {
    where: FloorplanScalarWhereInput
    data: XOR<FloorplanUpdateManyMutationInput, FloorplanUncheckedUpdateManyWithoutProjectInput>
  }

  export type FloorplanScalarWhereInput = {
    AND?: FloorplanScalarWhereInput | FloorplanScalarWhereInput[]
    OR?: FloorplanScalarWhereInput[]
    NOT?: FloorplanScalarWhereInput | FloorplanScalarWhereInput[]
    id?: StringFilter<"Floorplan"> | string
    projectId?: StringFilter<"Floorplan"> | string
    name?: StringFilter<"Floorplan"> | string
    level?: IntFilter<"Floorplan"> | number
    createdAt?: DateTimeFilter<"Floorplan"> | Date | string
    updatedAt?: DateTimeFilter<"Floorplan"> | Date | string
    data?: JsonFilter<"Floorplan">
  }

  export type MassingUpsertWithWhereUniqueWithoutProjectInput = {
    where: MassingWhereUniqueInput
    update: XOR<MassingUpdateWithoutProjectInput, MassingUncheckedUpdateWithoutProjectInput>
    create: XOR<MassingCreateWithoutProjectInput, MassingUncheckedCreateWithoutProjectInput>
  }

  export type MassingUpdateWithWhereUniqueWithoutProjectInput = {
    where: MassingWhereUniqueInput
    data: XOR<MassingUpdateWithoutProjectInput, MassingUncheckedUpdateWithoutProjectInput>
  }

  export type MassingUpdateManyWithWhereWithoutProjectInput = {
    where: MassingScalarWhereInput
    data: XOR<MassingUpdateManyMutationInput, MassingUncheckedUpdateManyWithoutProjectInput>
  }

  export type MassingScalarWhereInput = {
    AND?: MassingScalarWhereInput | MassingScalarWhereInput[]
    OR?: MassingScalarWhereInput[]
    NOT?: MassingScalarWhereInput | MassingScalarWhereInput[]
    id?: StringFilter<"Massing"> | string
    projectId?: StringFilter<"Massing"> | string
    name?: StringFilter<"Massing"> | string
    createdAt?: DateTimeFilter<"Massing"> | Date | string
    updatedAt?: DateTimeFilter<"Massing"> | Date | string
    massingData?: JsonFilter<"Massing">
    analysis?: JsonNullableFilter<"Massing">
  }

  export type Model3DUpsertWithWhereUniqueWithoutProjectInput = {
    where: Model3DWhereUniqueInput
    update: XOR<Model3DUpdateWithoutProjectInput, Model3DUncheckedUpdateWithoutProjectInput>
    create: XOR<Model3DCreateWithoutProjectInput, Model3DUncheckedCreateWithoutProjectInput>
  }

  export type Model3DUpdateWithWhereUniqueWithoutProjectInput = {
    where: Model3DWhereUniqueInput
    data: XOR<Model3DUpdateWithoutProjectInput, Model3DUncheckedUpdateWithoutProjectInput>
  }

  export type Model3DUpdateManyWithWhereWithoutProjectInput = {
    where: Model3DScalarWhereInput
    data: XOR<Model3DUpdateManyMutationInput, Model3DUncheckedUpdateManyWithoutProjectInput>
  }

  export type Model3DScalarWhereInput = {
    AND?: Model3DScalarWhereInput | Model3DScalarWhereInput[]
    OR?: Model3DScalarWhereInput[]
    NOT?: Model3DScalarWhereInput | Model3DScalarWhereInput[]
    id?: StringFilter<"Model3D"> | string
    projectId?: StringFilter<"Model3D"> | string
    floorplanId?: StringNullableFilter<"Model3D"> | string | null
    name?: StringFilter<"Model3D"> | string
    createdAt?: DateTimeFilter<"Model3D"> | Date | string
    updatedAt?: DateTimeFilter<"Model3D"> | Date | string
    modelData?: JsonFilter<"Model3D">
    settings?: JsonNullableFilter<"Model3D">
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUncheckedUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SiteAnalysisUpsertWithoutProjectInput = {
    update: XOR<SiteAnalysisUpdateWithoutProjectInput, SiteAnalysisUncheckedUpdateWithoutProjectInput>
    create: XOR<SiteAnalysisCreateWithoutProjectInput, SiteAnalysisUncheckedCreateWithoutProjectInput>
    where?: SiteAnalysisWhereInput
  }

  export type SiteAnalysisUpdateToOneWithWhereWithoutProjectInput = {
    where?: SiteAnalysisWhereInput
    data: XOR<SiteAnalysisUpdateWithoutProjectInput, SiteAnalysisUncheckedUpdateWithoutProjectInput>
  }

  export type SiteAnalysisUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
  }

  export type SiteAnalysisUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sunPathData?: NullableJsonNullValueInput | InputJsonValue
    weatherData?: NullableJsonNullValueInput | InputJsonValue
    topographyData?: NullableJsonNullValueInput | InputJsonValue
    contextData?: NullableJsonNullValueInput | InputJsonValue
    analysisResults?: NullableJsonNullValueInput | InputJsonValue
    boundary?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
  }

  export type SketchfabModelUpsertWithWhereUniqueWithoutProjectInput = {
    where: SketchfabModelWhereUniqueInput
    update: XOR<SketchfabModelUpdateWithoutProjectInput, SketchfabModelUncheckedUpdateWithoutProjectInput>
    create: XOR<SketchfabModelCreateWithoutProjectInput, SketchfabModelUncheckedCreateWithoutProjectInput>
  }

  export type SketchfabModelUpdateWithWhereUniqueWithoutProjectInput = {
    where: SketchfabModelWhereUniqueInput
    data: XOR<SketchfabModelUpdateWithoutProjectInput, SketchfabModelUncheckedUpdateWithoutProjectInput>
  }

  export type SketchfabModelUpdateManyWithWhereWithoutProjectInput = {
    where: SketchfabModelScalarWhereInput
    data: XOR<SketchfabModelUpdateManyMutationInput, SketchfabModelUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectCreateWithoutSiteAnalysisInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanCreateNestedManyWithoutProjectInput
    massings?: MassingCreateNestedManyWithoutProjectInput
    models3D?: Model3DCreateNestedManyWithoutProjectInput
    user?: UserCreateNestedOneWithoutProjectsInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutSiteAnalysisInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedCreateNestedManyWithoutProjectInput
    massings?: MassingUncheckedCreateNestedManyWithoutProjectInput
    models3D?: Model3DUncheckedCreateNestedManyWithoutProjectInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutSiteAnalysisInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutSiteAnalysisInput, ProjectUncheckedCreateWithoutSiteAnalysisInput>
  }

  export type ProjectUpsertWithoutSiteAnalysisInput = {
    update: XOR<ProjectUpdateWithoutSiteAnalysisInput, ProjectUncheckedUpdateWithoutSiteAnalysisInput>
    create: XOR<ProjectCreateWithoutSiteAnalysisInput, ProjectUncheckedCreateWithoutSiteAnalysisInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutSiteAnalysisInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutSiteAnalysisInput, ProjectUncheckedUpdateWithoutSiteAnalysisInput>
  }

  export type ProjectUpdateWithoutSiteAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUpdateManyWithoutProjectNestedInput
    massings?: MassingUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUpdateManyWithoutProjectNestedInput
    user?: UserUpdateOneWithoutProjectsNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutSiteAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedUpdateManyWithoutProjectNestedInput
    massings?: MassingUncheckedUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUncheckedUpdateManyWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutFloorplansInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    massings?: MassingCreateNestedManyWithoutProjectInput
    models3D?: Model3DCreateNestedManyWithoutProjectInput
    user?: UserCreateNestedOneWithoutProjectsInput
    siteAnalysis?: SiteAnalysisCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutFloorplansInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    massings?: MassingUncheckedCreateNestedManyWithoutProjectInput
    models3D?: Model3DUncheckedCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutFloorplansInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFloorplansInput, ProjectUncheckedCreateWithoutFloorplansInput>
  }

  export type Model3DCreateWithoutFloorplanInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutModels3DInput
  }

  export type Model3DUncheckedCreateWithoutFloorplanInput = {
    id?: string
    projectId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DCreateOrConnectWithoutFloorplanInput = {
    where: Model3DWhereUniqueInput
    create: XOR<Model3DCreateWithoutFloorplanInput, Model3DUncheckedCreateWithoutFloorplanInput>
  }

  export type Model3DCreateManyFloorplanInputEnvelope = {
    data: Model3DCreateManyFloorplanInput | Model3DCreateManyFloorplanInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutFloorplansInput = {
    update: XOR<ProjectUpdateWithoutFloorplansInput, ProjectUncheckedUpdateWithoutFloorplansInput>
    create: XOR<ProjectCreateWithoutFloorplansInput, ProjectUncheckedCreateWithoutFloorplansInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFloorplansInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFloorplansInput, ProjectUncheckedUpdateWithoutFloorplansInput>
  }

  export type ProjectUpdateWithoutFloorplansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    massings?: MassingUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUpdateManyWithoutProjectNestedInput
    user?: UserUpdateOneWithoutProjectsNestedInput
    siteAnalysis?: SiteAnalysisUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFloorplansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    massings?: MassingUncheckedUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUncheckedUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type Model3DUpsertWithWhereUniqueWithoutFloorplanInput = {
    where: Model3DWhereUniqueInput
    update: XOR<Model3DUpdateWithoutFloorplanInput, Model3DUncheckedUpdateWithoutFloorplanInput>
    create: XOR<Model3DCreateWithoutFloorplanInput, Model3DUncheckedCreateWithoutFloorplanInput>
  }

  export type Model3DUpdateWithWhereUniqueWithoutFloorplanInput = {
    where: Model3DWhereUniqueInput
    data: XOR<Model3DUpdateWithoutFloorplanInput, Model3DUncheckedUpdateWithoutFloorplanInput>
  }

  export type Model3DUpdateManyWithWhereWithoutFloorplanInput = {
    where: Model3DScalarWhereInput
    data: XOR<Model3DUpdateManyMutationInput, Model3DUncheckedUpdateManyWithoutFloorplanInput>
  }

  export type FloorplanCreateWithoutModels3DInput = {
    id?: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutFloorplansInput
  }

  export type FloorplanUncheckedCreateWithoutModels3DInput = {
    id?: string
    projectId: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
  }

  export type FloorplanCreateOrConnectWithoutModels3DInput = {
    where: FloorplanWhereUniqueInput
    create: XOR<FloorplanCreateWithoutModels3DInput, FloorplanUncheckedCreateWithoutModels3DInput>
  }

  export type ProjectCreateWithoutModels3DInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanCreateNestedManyWithoutProjectInput
    massings?: MassingCreateNestedManyWithoutProjectInput
    user?: UserCreateNestedOneWithoutProjectsInput
    siteAnalysis?: SiteAnalysisCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutModels3DInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedCreateNestedManyWithoutProjectInput
    massings?: MassingUncheckedCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutModels3DInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutModels3DInput, ProjectUncheckedCreateWithoutModels3DInput>
  }

  export type FloorplanUpsertWithoutModels3DInput = {
    update: XOR<FloorplanUpdateWithoutModels3DInput, FloorplanUncheckedUpdateWithoutModels3DInput>
    create: XOR<FloorplanCreateWithoutModels3DInput, FloorplanUncheckedCreateWithoutModels3DInput>
    where?: FloorplanWhereInput
  }

  export type FloorplanUpdateToOneWithWhereWithoutModels3DInput = {
    where?: FloorplanWhereInput
    data: XOR<FloorplanUpdateWithoutModels3DInput, FloorplanUncheckedUpdateWithoutModels3DInput>
  }

  export type FloorplanUpdateWithoutModels3DInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutFloorplansNestedInput
  }

  export type FloorplanUncheckedUpdateWithoutModels3DInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type ProjectUpsertWithoutModels3DInput = {
    update: XOR<ProjectUpdateWithoutModels3DInput, ProjectUncheckedUpdateWithoutModels3DInput>
    create: XOR<ProjectCreateWithoutModels3DInput, ProjectUncheckedCreateWithoutModels3DInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutModels3DInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutModels3DInput, ProjectUncheckedUpdateWithoutModels3DInput>
  }

  export type ProjectUpdateWithoutModels3DInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUpdateManyWithoutProjectNestedInput
    massings?: MassingUpdateManyWithoutProjectNestedInput
    user?: UserUpdateOneWithoutProjectsNestedInput
    siteAnalysis?: SiteAnalysisUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutModels3DInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedUpdateManyWithoutProjectNestedInput
    massings?: MassingUncheckedUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutMassingsInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanCreateNestedManyWithoutProjectInput
    models3D?: Model3DCreateNestedManyWithoutProjectInput
    user?: UserCreateNestedOneWithoutProjectsInput
    siteAnalysis?: SiteAnalysisCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMassingsInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedCreateNestedManyWithoutProjectInput
    models3D?: Model3DUncheckedCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMassingsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMassingsInput, ProjectUncheckedCreateWithoutMassingsInput>
  }

  export type ProjectUpsertWithoutMassingsInput = {
    update: XOR<ProjectUpdateWithoutMassingsInput, ProjectUncheckedUpdateWithoutMassingsInput>
    create: XOR<ProjectCreateWithoutMassingsInput, ProjectUncheckedCreateWithoutMassingsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMassingsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMassingsInput, ProjectUncheckedUpdateWithoutMassingsInput>
  }

  export type ProjectUpdateWithoutMassingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUpdateManyWithoutProjectNestedInput
    user?: UserUpdateOneWithoutProjectsNestedInput
    siteAnalysis?: SiteAnalysisUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMassingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUncheckedUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserCreateWithoutSketchfabTokensInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSketchfabTokensInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    sketchfabModels?: SketchfabModelUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSketchfabTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSketchfabTokensInput, UserUncheckedCreateWithoutSketchfabTokensInput>
  }

  export type UserUpsertWithoutSketchfabTokensInput = {
    update: XOR<UserUpdateWithoutSketchfabTokensInput, UserUncheckedUpdateWithoutSketchfabTokensInput>
    create: XOR<UserCreateWithoutSketchfabTokensInput, UserUncheckedCreateWithoutSketchfabTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSketchfabTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSketchfabTokensInput, UserUncheckedUpdateWithoutSketchfabTokensInput>
  }

  export type UserUpdateWithoutSketchfabTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSketchfabTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSketchfabModelsInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSketchfabModelsInput = {
    id?: string
    clerkId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    sketchfabTokens?: SketchfabTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSketchfabModelsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSketchfabModelsInput, UserUncheckedCreateWithoutSketchfabModelsInput>
  }

  export type ProjectCreateWithoutSketchfabModelsInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanCreateNestedManyWithoutProjectInput
    massings?: MassingCreateNestedManyWithoutProjectInput
    models3D?: Model3DCreateNestedManyWithoutProjectInput
    user?: UserCreateNestedOneWithoutProjectsInput
    siteAnalysis?: SiteAnalysisCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutSketchfabModelsInput = {
    id?: string
    name: string
    description?: string | null
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedCreateNestedManyWithoutProjectInput
    massings?: MassingUncheckedCreateNestedManyWithoutProjectInput
    models3D?: Model3DUncheckedCreateNestedManyWithoutProjectInput
    siteAnalysis?: SiteAnalysisUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutSketchfabModelsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutSketchfabModelsInput, ProjectUncheckedCreateWithoutSketchfabModelsInput>
  }

  export type UserUpsertWithoutSketchfabModelsInput = {
    update: XOR<UserUpdateWithoutSketchfabModelsInput, UserUncheckedUpdateWithoutSketchfabModelsInput>
    create: XOR<UserCreateWithoutSketchfabModelsInput, UserUncheckedCreateWithoutSketchfabModelsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSketchfabModelsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSketchfabModelsInput, UserUncheckedUpdateWithoutSketchfabModelsInput>
  }

  export type UserUpdateWithoutSketchfabModelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSketchfabModelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    sketchfabTokens?: SketchfabTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectUpsertWithoutSketchfabModelsInput = {
    update: XOR<ProjectUpdateWithoutSketchfabModelsInput, ProjectUncheckedUpdateWithoutSketchfabModelsInput>
    create: XOR<ProjectCreateWithoutSketchfabModelsInput, ProjectUncheckedCreateWithoutSketchfabModelsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutSketchfabModelsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutSketchfabModelsInput, ProjectUncheckedUpdateWithoutSketchfabModelsInput>
  }

  export type ProjectUpdateWithoutSketchfabModelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUpdateManyWithoutProjectNestedInput
    massings?: MassingUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUpdateManyWithoutProjectNestedInput
    user?: UserUpdateOneWithoutProjectsNestedInput
    siteAnalysis?: SiteAnalysisUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutSketchfabModelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedUpdateManyWithoutProjectNestedInput
    massings?: MassingUncheckedUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUncheckedUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SketchfabTokenCreateManyUserInput = {
    id?: string
    accessToken: string
    refreshToken: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SketchfabModelCreateManyUserInput = {
    id?: string
    modelUid: string
    projectId: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
  }

  export type ProjectUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUpdateManyWithoutProjectNestedInput
    massings?: MassingUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplans?: FloorplanUncheckedUpdateManyWithoutProjectNestedInput
    massings?: MassingUncheckedUpdateManyWithoutProjectNestedInput
    models3D?: Model3DUncheckedUpdateManyWithoutProjectNestedInput
    siteAnalysis?: SiteAnalysisUncheckedUpdateOneWithoutProjectNestedInput
    sketchfabModels?: SketchfabModelUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabModelUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutSketchfabModelsNestedInput
  }

  export type SketchfabModelUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabModelUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FloorplanCreateManyProjectInput = {
    id?: string
    name: string
    level?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    data: JsonNullValueInput | InputJsonValue
  }

  export type MassingCreateManyProjectInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    massingData: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DCreateManyProjectInput = {
    id?: string
    floorplanId?: string | null
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SketchfabModelCreateManyProjectInput = {
    id?: string
    modelUid: string
    userId: string
    fileUrl: string
    attribution: JsonNullValueInput | InputJsonValue
    license: string
    createdAt?: Date | string
  }

  export type FloorplanUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    models3D?: Model3DUpdateManyWithoutFloorplanNestedInput
  }

  export type FloorplanUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    models3D?: Model3DUncheckedUpdateManyWithoutFloorplanNestedInput
  }

  export type FloorplanUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
  }

  export type MassingUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type MassingUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    massingData?: JsonNullValueInput | InputJsonValue
    analysis?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
    floorplan?: FloorplanUpdateOneWithoutModels3DNestedInput
  }

  export type Model3DUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    floorplanId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    floorplanId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SketchfabModelUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSketchfabModelsNestedInput
  }

  export type SketchfabModelUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SketchfabModelUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelUid?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    attribution?: JsonNullValueInput | InputJsonValue
    license?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Model3DCreateManyFloorplanInput = {
    id?: string
    projectId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modelData: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUpdateWithoutFloorplanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutModels3DNestedInput
  }

  export type Model3DUncheckedUpdateWithoutFloorplanInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type Model3DUncheckedUpdateManyWithoutFloorplanInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modelData?: JsonNullValueInput | InputJsonValue
    settings?: NullableJsonNullValueInput | InputJsonValue
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}