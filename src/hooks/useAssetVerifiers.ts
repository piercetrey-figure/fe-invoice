import { ROOT_ASSET_CLASSIFICATION_NAME, ROOT_NAME } from "consts"
import { useQuery } from "react-query"
import { AssetClassificationContractService } from "services"
import { NameContractService } from "services/NameContractService"

export const useAssetVerifiers = () => {
    return useQuery(['asset_verifiers'], async () => {
        const aCService = new AssetClassificationContractService(ROOT_ASSET_CLASSIFICATION_NAME)
        const results = await aCService.getInvoiceAssetDefinition()
        return results.verifiers
    })
}