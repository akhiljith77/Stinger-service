import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService:JwtService){}

    async canActivate(context: ExecutionContext):  Promise<boolean>  {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);
        if(!token){
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token,{secret:process.env.JWT_SECRET})
            req['user'] = payload
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }


    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization'] || request.header('Authorization');
        const [type, token] = authHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}