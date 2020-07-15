type PropsOf<T> = { [key in Extract<keyof T, string | symbol>]?: T[key] };

export function toClass<T>(Cls: new () => T, props: PropsOf<T>): T {
  const cls = new Cls();
  Object.assign(cls, props);
  return cls;
}
