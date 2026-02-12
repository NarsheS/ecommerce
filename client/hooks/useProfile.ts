export function useProfile() {
    async function getUser() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            method: "GET",
            credentials: "include", // importante se usar cookie
            cache: "no-store",
        })

        if (!res.ok) throw new Error("Erro ao buscar usuário")

        return res.json()
    }
}