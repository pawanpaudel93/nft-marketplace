<template>
  <div class="flex justify-center">
    <div class="px-4" style="max-width: 1600px">
      <div
        v-if="nfts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"
      >
        <div
          v-for="(nft, i) in nfts"
          :key="i"
          class="border shadow rounded-xl overflow-hidden"
        >
          <img :src="nft.image" />
          <div class="p-4">
            <p style="height: 64px" class="text-2xl font-semibold">
              {{ nft.name }}
            </p>
          </div>

          <div class="p-4 bg-black">
            <p class="text-2xl mb-4 font-bold text-white">
              {{ nft.price }} Matic
            </p>
            <button
              class="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
              @click="buyNFTs(nft)"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="text-center mt-6">
          <p class="text-2xl font-semibold text-black">No assets owned.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useFetch,
  useContext,
  reactive,
} from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import NFT from '@/contract/artifacts/contracts/NFT.sol/NFT.json'
import Market from '@/contract/artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json'
import { Item } from '@/interfaces/item'
export default defineComponent({
  name: 'MyAssets',
  setup() {
    const { $axios, $config } = useContext()
    const nfts = reactive<Item[]>([])
    const loadingState = ref('not-loaded')

    const { fetch, fetchState } = useFetch(async () => {
      await loadNFTs()
    })

    const loadNFTs = async () => {
      const provider = new ethers.providers.JsonRpcProvider()
      const tokenContract = new ethers.Contract(
        $config.nftAddress,
        NFT.abi,
        provider
      )
      const marketContract = new ethers.Contract(
        $config.nftMarketAddress,
        Market.abi,
        provider
      )
      const data = await marketContract.fetchMyNFTs()
      const items: Item[] = await Promise.all(
        data.map(async (i: any) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId)
          const meta = await $axios.$get(tokenUri)
          const price = ethers.utils.formatEther(i.price.toString())
          const item = {
            price,
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          }
          return item
        })
      )
      nfts.push(...items)
      loadingState.value = 'loaded'
    }
    return {
      nfts,
      loadingState,
    }
  },
})
</script>
