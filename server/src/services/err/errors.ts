import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';

export const not_found = 'not_found';
export const unauthorized = 'unauthorized';
export const invalid = 'invalid';
export const expired = 'expired';
export const conflict = 'conflict';

type ErrorInfo = {
  description: string;
  error: string;
};

export const notFoundException = (error: ErrorInfo) =>
  new NotFoundException(error);

export const conflictException = (error: ErrorInfo) =>
  new ConflictException(error);

export const badRequestException = (error: ErrorInfo) =>
  new BadRequestException(error);

export const notAcceptableException = (error: ErrorInfo) =>
  new NotAcceptableException(error);

export const unauthorizedException = (error: ErrorInfo) =>
  new UnauthorizedException(error);
