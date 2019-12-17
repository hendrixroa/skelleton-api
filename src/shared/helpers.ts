import { ContainerType } from '@/container';
import { IsIn } from 'class-validator';

export function getEnumValues(Enum: any) {
  return Object.keys(Enum).map(key => Enum[key as keyof typeof Enum]);
}

export function IsEnum(Enum: any, each: boolean = false) {
  return IsIn(getEnumValues(Enum), { each });
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export interface ClassConstructor {
  name: string;
}

export function getLogService() {
  const container = require('@/container').container as ContainerType;
  const logService = container.resolve('logService');
  return logService;
}

export function getClassLog(constructor: ClassConstructor, commonData?: any) {
  const logData = { ...commonData, class: constructor.name };
  const container = require('@/container').container as ContainerType;
  const logService = container.resolve('logService');
  const log = logService.getChildLog(logData);
  return log;
}

type PropsOf<T> = { [key in Extract<keyof T, string | symbol>]?: T[key] };

export function toClass<T>(Cls: new () => T, props: PropsOf<T>): T {
  const cls = new Cls();
  Object.assign(cls, props);
  return cls;
}

export type ArrayElement<ArrayType> = ArrayType extends Array<infer ElementType>
  ? ElementType
  : never;
