import { Address } from "../types/Address";
import { api } from "./api";

export const addressService = {
    async read(): Promise<Address[]> {
        const { data } = await api.get("users/address")
        return data
    },

    async create(address: {
        street: string
        number: string
        city: string
        state: string
        zipcode: string
        }): Promise<Address> {

        const { data } = await api.post("users/address", address)
        return data
    },

    async update(
        id: number,
        data: Partial<Address>
        ): Promise<Address> {

        const { data: response } = await api.patch(
            `users/address/${id}`,
            data
        )

        return response
    },

    async delete(id: number) {
        await api.delete(`users/address/${id}`)
    },

}