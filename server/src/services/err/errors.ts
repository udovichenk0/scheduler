import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class Err {
  code: number
  message: string
  constructor(code: number, message: string){
    this.code = code
    this.message = message
  }
}

export class Errors {
  static EmailIsTaken(email: string){
    return new Err(403, `Email ${email} is already taken`)
  }
  static ConfirmationNotFound(){
    return new Err(404, `Confirmation not found`)
  }
  static UserNotFound(email: string){
    return new Err(404, `User with email ${email} not found`)
  }
  //general
  static GeneralNotFound(entity: string, id: string){
    return new Err(404, `${entity} not found for Id ${id}`)
  }
  static GeneralInvalid(entity: string, value: string){
    return new Err(400, `${entity} ${value} is invalid`)
  }
  static Unauthorized(){
    return new Err(401, "User is not Authorized")
  }
  static Missing(entity: string){
    return new Err(400, `${entity} is missing`)
  }
  static InternalServerError(){
    return new Err(503, 'Internal server error')
  }
}

export function isError(err: unknown): err is Err{
  return err instanceof Err
}

export function handleError(er: Err){
  switch(er.code){
    case 400: 
      return new BadRequestException(er)
    case 401:
      return new UnauthorizedException(er)
    case 404:
      return new NotFoundException(er)
    case 503: 
      return new InternalServerErrorException(er)
  }
}