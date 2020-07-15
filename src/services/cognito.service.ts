import * as cognito from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';

import { LogService } from '@/services/log.service';

import { APPConfig } from '@/config/app.config';
import {
  UserSignUpPayload,
  SignInResponse,
  SignUpResponse,
  UserSignInPayload,
  UserVerifyCodePayload,
  VerifyCodeResponse,
  RefreshTokenPayload,
  RefreshTokenResult,
  UserResendCodePayload,
  ForgotPasswordPayload,
  ConfirmPasswordPayload,
} from '@/services/auth.service';

import Global = NodeJS.Global;
export interface GlobalWithCognitoFix extends Global {
  fetch: any;
}
declare const global: GlobalWithCognitoFix;
// tslint:disable-next-line: no-var-requires
global.fetch = require('node-fetch');

@Injectable()
export class CognitoService {
  private userPool: cognito.CognitoUserPool;

  constructor(private logService: LogService) {
    this.userPool = new cognito.CognitoUserPool({
      UserPoolId: APPConfig.cognitoUserPoolId,
      ClientId: APPConfig.cognitoClientId,
    });
  }

  public async signUp(
    payload: UserSignUpPayload,
    uuid = '',
  ): Promise<SignUpResponse> {
    const attributeList = [
      new cognito.CognitoUserAttribute({
        Name: 'nickname',
        Value: payload.username,
      }),
      new cognito.CognitoUserAttribute({
        Name: 'custom:role',
        Value: payload.role,
      }),
      new cognito.CognitoUserAttribute({
        Name: 'custom:uuid',
        Value: uuid,
      }),
    ];

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        payload.email,
        payload.password,
        attributeList,
        [],
        (err: any, data: any) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'The confirmation code was sent to email',
          });
        },
      );
    });
  }

  public async login(payload: UserSignInPayload): Promise<SignInResponse> {
    const authenticationDetails = new cognito.AuthenticationDetails({
      Username: payload.email,
      Password: payload.password,
    });

    const userData = {
      Username: payload.email,
      Pool: this.userPool,
    };

    const cognitoUser = new cognito.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          const authData = {
            token: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
            mfa: null,
          };
          return resolve(authData);
        },
        onFailure: (err: any) => {
          return reject(err);
        },
      });
    });
  }

  public async verifyCode(
    payload: UserVerifyCodePayload,
  ): Promise<VerifyCodeResponse> {
    const userData = {
      Username: payload.email,
      Pool: this.userPool,
    };

    return new Promise((resolve, reject) => {
      const cognitoUser = new cognito.CognitoUser(userData);
      cognitoUser.confirmRegistration(
        payload.code,
        true,
        (err: any, data: any) => {
          if (err) {
            return reject(err);
          }
          return resolve({ message: 'Success' });
        },
      );
    });
  }

  public async refreshToken(
    payload: RefreshTokenPayload,
  ): Promise<RefreshTokenResult> {
    const RefreshToken = new cognito.CognitoRefreshToken({
      RefreshToken: payload.refreshToken,
    });

    const userData = {
      Username: payload.email,
      Pool: this.userPool,
    };

    const cognitoUser = new cognito.CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(RefreshToken, (err: any, session: any) => {
        if (err) {
          return reject(err);
        }
        const refreshObj = {
          token: session.idToken.jwtToken,
        };
        return resolve(refreshObj);
      });
    });
  }

  public async resendConfirmation(payload: UserResendCodePayload) {
    const userData = {
      Username: payload.email,
      Pool: this.userPool,
    };

    const cognitoUser = new cognito.CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          return reject(err.message);
        }
        return resolve(result);
      });
    });
  }

  public async forgotPassword(
    forgotPayload: ForgotPasswordPayload,
  ): Promise<any> {
    const userData = {
      Username: forgotPayload.email,
      Pool: this.userPool,
    };

    const cognitoUser = new cognito.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: function(data) {
          return resolve(data);
        },
        onFailure: function(err) {
          return reject(err.message || JSON.stringify(err));
        },
      });
    });
  }

  public async confirmPassword(
    confirmPayload: ConfirmPasswordPayload,
  ): Promise<any> {
    const userData = {
      Username: confirmPayload.email,
      Pool: this.userPool,
    };

    const cognitoUser = new cognito.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(
        confirmPayload.code,
        confirmPayload.password,
        {
          onSuccess() {
            return resolve('Password confirmed!');
          },
          onFailure(err) {
            return reject(err.message);
          },
        },
      );
    });
  }
}
