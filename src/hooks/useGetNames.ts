import { ROOT_NAME } from "consts"
import { useQuery } from "react-query"
import { NameContractService } from "services/NameContractService"

export const useGetNames = (address: string) => {
    const nameService = new NameContractService(ROOT_NAME)
    return useQuery(['names', address], async () => {
        return await nameService.listNames(address)
    })
}