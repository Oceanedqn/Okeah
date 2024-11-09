export interface RegisterResponse {
    name: string;
    firstname: string;
    mail: string;
    gender: boolean;
}

// Create an interface for the registration data
export interface RegisterData {
    name: string;
    firstname: string;
    mail: string;
    password: string;
    gender: boolean;
}