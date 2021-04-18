import { useEffect, useState } from 'react'
import { BigNumber } from 'bignumber.js';

import ERC20_INTERFACE from '../constants/abis/erc20'
import priceContracts from '../constants/gmePriceContracts'
import { useMulticallContract } from './useContract';


type ApiResponse = {
  prices: {
    [key: string]: string
  }
  update_at: string
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
const api = 'https://api.pancakeswap.com/api/v1/price'

const useGetPriceData = () => {
  const [data, setData] = useState<ApiResponse | null>(null)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api)
        const res: ApiResponse = await response.json()

        if(multicallContract){
          const {gmeAddress, busdAddress, lpAddress} = priceContracts;
          const calls = [
            [gmeAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [busdAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];

          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [gmeAmount, busdAmount] = result.map(r=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const gme = new BigNumber(gmeAmount);
          const busd = new BigNumber(busdAmount);
          const gmePrice = busd.div(gme).toString();

          res.prices.GME = gmePrice;
        }

        setData(res)
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [setData, multicallContract])

  return data
}

export default useGetPriceData
