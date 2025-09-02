import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private usersService: UsersService,
    configService: ConfigService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/users/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { emails, photos, displayName } = profile;
      const email = emails[0].value;
  
      // console.log("Google Profile Data:", profile);
      let user = await this.usersService.findByEmail(email);
  
      if (!user) {
        user = await this.usersService.createGoogleUser({
          email,
          name: displayName,
          profileImage: photos[0].value,
        });
        // console.log("Created new Google user:", user);
      } else if (user.provider !== 'google') {
        // console.log("User exists with different provider:", user);
        return done(new Error('User already registered with email & password'), false);
      }
  
      done(null, user);
    } catch (error) {
      console.error("Error in GoogleStrategy validate:", error);
      done(error, false);
    }
  }
}
