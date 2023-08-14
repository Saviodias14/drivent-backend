import { cannotEnrollBeforeStartDateError, requestError } from "@/errors";
import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import eventsService from "../events-service";
import { duplicatedEmailError } from "./errors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  // await canEnrollOrFail();
  await validateUniqueEmailOrFail(email);
  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function canEnrollOrFail() {
  const canEnroll = await eventsService.isCurrentEventActive();
  if (!canEnroll) {
    throw cannotEnrollBeforeStartDateError();
  }
}

type AuthParams = {
  code: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

async function gitUserToken(code: string){
  const GITHUB_ACESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
  const AuthParams: AuthParams = {
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/sign-in",
    client_id: process.env.GITHUB_CLIENT_ID || "b6f11093042790df58f4",
    client_secret: process.env.GITHUB_CLIENT_SECRET || "72faa3a3104131275183feba62a4fd58b726b3d3",
  }

  const { data } = await axios.post(GITHUB_ACESS_TOKEN_URL, AuthParams, {
    headers: {
      "content-type": "application/json",
    },
  });
  if (!data) requestError(404, 'Not Found')
  const params = new URLSearchParams(data);
  const access_token = params.get('access_token');
  return access_token;
}

export type CreateUserParams = Pick<User, "email" | "password">;

export async function gitHubUser(token: string) {
  const GITHUB_USER_URL = "https://api.github.com/user";
  const response = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if(!response.data) throw requestError(403, 'Forbidden')
  return response.data;
}

const userService = {
  createUser,
  gitUserToken,
  gitHubUser
};

export * from "./errors";
export default userService;
