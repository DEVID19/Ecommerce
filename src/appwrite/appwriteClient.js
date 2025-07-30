// import { Client, Databases, Storage, ID, Account } from "appwrite";

// const client = new Client();

// client
//   .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//   .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// export const databases = new Databases(client);
// export const storage = new Storage(client);
// export const account = new Account(client);
// export const appwriteID = ID;

import {
  Client,
  Databases,
  Storage,
  ID,
  Account,
  Query,
  Avatars,
} from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);
const avatars = new Avatars(client);

export { client, databases, storage, account, ID, Query, avatars };
