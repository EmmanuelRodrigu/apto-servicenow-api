
export interface CreateUser {
    name: string,
    first_last_name: string,
    second_last_name: string,
    rol: string,
    user_data: {email: string, password: string},
}