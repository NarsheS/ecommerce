import { Profile } from "./profile"

export type Address = {
    id: number
    street: string
    number: string
    city: string
    state: string
    zipcode: string
    user: Profile
}