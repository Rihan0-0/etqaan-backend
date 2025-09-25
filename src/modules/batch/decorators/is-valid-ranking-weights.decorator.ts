import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidRankingWeights(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidRankingWeights',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object') return false;

          const keys = ['attendance', 'memorization', 'revision', 'exams'];
          for (const key of keys) {
            if (typeof value[key] !== 'number') return false;
            if (value[key] < 0 || value[key] > 1) return false;
          }

          const sum = keys.reduce((acc, key) => acc + value[key], 0);
          if (Math.abs(sum - 1) > 0.0001) return false;

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must have numbers between 0 and 1 for attendance, memorization, revision, exams, and sum to 1`;
        },
      },
    });
  };
}
