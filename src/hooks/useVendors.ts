import { ROOT_NAME } from "consts"
import { useQuery } from "react-query"
import { NameContractService } from "services/NameContractService"

export const useVendors = (search: string) => {
    const nameService = new NameContractService(ROOT_NAME)
    return useQuery(['vendors', search], async () => {
        const results = await nameService.searchNames(search)
        return results
    })
}