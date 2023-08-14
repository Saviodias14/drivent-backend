import authenticationService, { SignInParams } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import userService from "@/services/users-service";
import userRepository from "@/repositories/user-repository";


export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
export async function gitSignIn(req: Request, res: Response) {
  const code = req.body.code as string;
  if (!code) return res.status(httpStatus.BAD_REQUEST).send("Missing code");
  
  try {
    const token = await userService.gitUserToken(code);
    const gitUser = await userService.gitHubUser(token);
    const email = gitUser.html_url;
    const password = gitUser.id.toString();

    const dbUser = await userRepository.findByEmail(email, { id: true, email: true, password: false } );
    if (!dbUser){
      await userService.createUser({ email, password });
    }
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}