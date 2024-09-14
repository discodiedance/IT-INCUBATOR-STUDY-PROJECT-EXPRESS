export class OutputUserType {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string
  ) {}
}

export class UserDBType {
  constructor(
    public id: string,
    public accountData: UserAccountType,
    public emailConfirmation: EmailConfirmationType,
    public passwordRecoveryConfirmation: PasswordRecoveryType
  ) {}
}

export class UserAccountType {
  constructor(
    public email: string,
    public login: string,
    public createdAt: string,
    public passwordHash: string,
    public passwordSalt: string
  ) {}
}

export class EmailConfirmationType {
  constructor(
    public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean
  ) {}
}

export class PasswordRecoveryType {
  constructor(
    public recoveryCode: string,
    public expirationDate: Date | null
  ) {}
}
