import { BASE_URL } from "consts"
import { useQuery } from "react-query"

export const useGetDenoms = () => {
    return useQuery<string[]>(['denoms'], async () => {
        const res = await fetch(`${BASE_URL}/denom/all`)
        
        return await res.json()
    })
}