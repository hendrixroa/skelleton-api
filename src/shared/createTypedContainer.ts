import {
  AwilixContainer,
  ContainerOptions,
  createContainer,
  ResolveOptions,
  Resolver,
} from 'awilix';

interface ContainerDefinition {
  [key: string]: Resolver<unknown>;
}

type ExtractResolverType<T> = T extends Resolver<infer X> ? X : null;

interface TypedAwilixContainer<T extends ContainerDefinition>
  extends Pick<
    AwilixContainer,
    Exclude<keyof AwilixContainer, 'resolve' | 'createScope'>
  > {
  resolve<K extends keyof T>(
    key: K,
    resolveOptions?: ResolveOptions,
  ): ExtractResolverType<T[K]>;

  createScope(): TypedAwilixContainer<T>;
}

export function createTypedContainer<T extends ContainerDefinition>(
  registrations: T,
  opts?: ContainerOptions,
): TypedAwilixContainer<T> {
  return createContainer(opts).register(registrations) as any;
}
