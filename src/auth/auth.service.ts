import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  signIn(signInDto: SignInDto) {
    console.log(signInDto);
    return 'Sign In';
  }

  signUp(signUpDto: SignUpDto) {
    console.log(signUpDto);
    return 'Sign Up';
  }
}
