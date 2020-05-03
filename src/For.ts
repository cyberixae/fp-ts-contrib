/**
 * This module provides a simuation of Scala for notation.
 */
import { sequenceS } from 'fp-ts/lib/Apply'
import { HKT, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Monad, Monad1, Monad2, Monad2C, Monad3 } from 'fp-ts/lib/Monad'
import { Filterable, Filterable3, Filterable2, Filterable2C, Filterable1 } from 'fp-ts/lib/Filterable'
import { Predicate } from 'fp-ts/lib/function'
import { Do0, Do1, Do2, Do2C, Do3, Do3C } from './Do'

export interface For3<M extends URIS3, S extends object> extends Do3<M, S> {
  filter: (f: Predicate<S>) => For3<M, S>
}

export interface For3C<M extends URIS3, S extends object, R, E> extends Do3C<M, S, R, E> {
  filter: (f: Predicate<S>) => For3C<M, S, R, E>
}

export interface For2<M extends URIS2, S extends object> extends Do2<M, S> {
  filter: (f: Predicate<S>) => For2<M, S>
}

export interface For2C<M extends URIS2, S extends object, E> extends Do2C<M, S, E> {
  filter: (f: Predicate<S>) => For2C<M, S, E>
}

export interface For1<M extends URIS, S extends object> extends Do1<M, S> {
  filter: (f: Predicate<S>) => For1<M, S>
}

export interface For0<M, S extends object> extends Do0<M, S> {
  filter: (f: Predicate<S>) => For0<M, S>
}

class ForClass<M> {
  constructor(readonly M: Monad<M> & Filterable<M>, private result: HKT<M, any>) {}
  filter(f: Predicate<any>): ForClass<M> {
    return new ForClass(this.M, this.M.filter(this.result, f))
  }
  do(action: HKT<M, any>): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.chain(this.result, s => this.M.map(action, () => s))
    )
  }
  doL(f: (s: any) => HKT<M, any>): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.chain(this.result, s => this.M.map(f(s), () => s))
    )
  }
  bind(name: string, action: HKT<M, any>): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.chain(this.result, s => this.M.map(action, b => Object.assign({}, s, { [name]: b })))
    )
  }
  bindL(name: string, f: (s: any) => HKT<M, any>): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.chain(this.result, s => this.M.map(f(s), b => Object.assign({}, s, { [name]: b })))
    )
  }
  let(name: string, a: any): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.map(this.result, s => Object.assign({}, s, { [name]: a }))
    )
  }
  letL(name: string, f: (s: any) => any): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.map(this.result, s => Object.assign({}, s, { [name]: f(s) }))
    )
  }
  sequenceS(r: Record<string, HKT<M, any>>): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.chain(this.result, s => this.M.map(sequenceS(this.M)(r), r => Object.assign({}, s, r)))
    )
  }
  sequenceSL(f: (s: any) => Record<string, HKT<M, any>>): ForClass<M> {
    return new ForClass(
      this.M,
      this.M.chain(this.result, s => this.M.map(sequenceS(this.M)(f(s)), r => Object.assign({}, s, r)))
    )
  }
  return<B>(f: (s: any) => B): HKT<M, B> {
    return this.M.map(this.result, f)
  }
  done(): HKT<M, any> {
    return this.result
  }
}

const init = {}

/**
 * This function provides a simulation of Scalas for notation.
 *
 * @example
 * import { option, some } from 'fp-ts/lib/Option'
 * import { For } from 'fp-ts-contrib/lib/For'
 *
 * // x: Option<number>
 * const x = For(option) // <- a monad instance
 *   .bindL('foo', () => some('bar'))
 *   .bindL('baz', () => some(4))
 *   .return(({ foo, baz }) => foo.length + baz)
 *
 * assert.deepStrictEqual(x, some(7))
 *
 * @since 0.0.2
 */
export function For<M extends URIS3>(M: Monad3<M> & Filterable3<M>): For3<M, {}>
export function For<M extends URIS2>(M: Monad2<M> & Filterable2<M>): For2<M, {}>
export function For<M extends URIS2, L>(M: Monad2C<M, L> & Filterable2C<M, L>): For2C<M, {}, L>
export function For<M extends URIS>(M: Monad1<M> & Filterable1<M>): For1<M, {}>
export function For<M>(M: Monad<M> & Filterable<M>): For0<M, {}>
export function For<M>(M: Monad<M> & Filterable<M>): any {
  return new ForClass(M, M.of(init))
}
