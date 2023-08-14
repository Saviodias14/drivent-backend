import { cannotEnrollBeforeStartDateError } from "@/errors";
import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import eventsService from "../events-service";
import { duplicatedEmailError } from "./errors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  await canEnrollOrFail();
  await validateUniqueEmailOrFail(email);
  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

export type CreateUserParams = Pick<User, "email" | "password">;

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
};

async function gitUserToken(code: string) {
  const acess = process.env.GITHUB_ACESS_TOKEN_URL;
  const AuthParams: AuthParams = {
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
    client_id: process.env.GIT_CLIENT_ID,
    client_secret: process.env.GIT_CLIENT_SECRET,
  };

  const { data } = await axios.post(acess, AuthParams, {
    headers: {
      "content-type": "application/json",
    },
  });
  if (!data) throw new Error("UNAUTHORIZED");

  const params = new URLSearchParams(data);
  const access_token = params.get("access_token");
  return access_token;
}

export async function gitHubUser(token: string) {
  const GITHUB_USER_URL = "https://api.github.com/user";
  const response = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data) throw new Error("UNAUTHORIZED");
  return response.data;
}

const userService = {
  createUser,
  gitUserToken,
  gitHubUser
};

export * from "./errors";
export default userService;
