import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user) throw new InternalServerErrorException('User Not Found(Request)');
        return (!data) ? user : user[data];
    }
)