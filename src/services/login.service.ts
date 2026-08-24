import { User,LoginInput } from "@/types/user";

export async function login(user:LoginInput):Promise<User> {
    const { email, password } = user
    
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
    })

    if (!response.ok) {
  const data = await response.json();
  throw new Error(data.error || "Failed to login");
}

    return response.json()
}