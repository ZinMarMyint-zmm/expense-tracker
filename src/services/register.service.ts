import { User,CreateUserInput } from "@/types/user";

export async function register(user:CreateUserInput):Promise<User> {
    const { name, email, password } = user
    
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({name,email,password})
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error (data.error || "Failed to create a new user")
    }

    return data
}