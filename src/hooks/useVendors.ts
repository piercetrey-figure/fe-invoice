import { useQuery } from "react-query"

export const useVendors = () => {
    return useQuery(['vendors'], async () => {
        return ['one', 'two']
    })
}