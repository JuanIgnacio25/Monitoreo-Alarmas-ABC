import axios from "axios";

export async function getUsers() {
  
  const users = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`);

  return users.data;
}