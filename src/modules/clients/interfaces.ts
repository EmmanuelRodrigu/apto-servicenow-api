export interface DataClient {
    person: string | null,
    dataTaxId: number,
    rfc: string,
    reason_social: string
    name: string,
    street: string,
    cp: string,
    municipality: string,
    estate: string,
}

export interface DataContact {
    name: string,
    last_name: string,
    email: string,
    phone: string,
    area: string | null,
    is_major_contact: boolean,
}

export interface MatchClientData {
    id: number
    rfc: string,
    name: string,
    full_name: string,
    email: string,
    phone: string,
}