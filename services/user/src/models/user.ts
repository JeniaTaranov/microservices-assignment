export interface NewUser {
    name: string;
    email: string;
}

export interface User extends NewUser {
    id: string;
    created_at: string;
}