import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

export class IsUsernameConstraint implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    return /^[a-zA-Z0-9_][a-zA-Z0-9_-]{2,31}$/.test(userName);
  }
}

export function IsUsername(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameConstraint,
    });
  };
}
