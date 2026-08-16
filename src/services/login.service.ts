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
        throw new Error ("Failed to create a new user")
    }

    return response.json()
}