/* eslint-disable no-unused-vars */
import axios from "axios";
import { auth } from "./UseFirebase";

const production =
  "https://us-central1-fullaccezz-2756a.cloudfunctions.net/app/";
const stage = "http://10.0.2.2:5001/fullaccezz-2756a/us-central1/app/";

const client = axios.create({
  baseURL: production,
  timeout: 3000000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(async (config) => {
  if (!auth?.currentUser) return config;
  const token = await auth?.currentUser?.getIdToken();
  config.headers.Authorization = `${token}`;
  return config;
});

export default client;
