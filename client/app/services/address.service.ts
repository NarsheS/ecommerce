import { Address } from "../types/Address";
import { api } from "./api";

export const addressService = {
    async getAddresses(): Promise<Address> {
        const { data } = await api.get("users/address")
        return data
    }
}