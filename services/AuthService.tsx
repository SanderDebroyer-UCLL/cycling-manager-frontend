import { Credentials } from "@/types/credentials";

const loginUser = (Credentials: Credentials) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Credentials),
    });
};

const signupUser = (Credentials: Credentials) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/create-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Credentials),  
    });
}

export default {
    loginUser,
    signupUser
}