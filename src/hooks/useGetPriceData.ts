import { useEffect, useState } from 'react'
import { BigNumber } from 'bignumber.js';

import { PAIR_INTERFACE } from 'data/Reserves';
import { useMultipleContractSingleData } from 'state/multicall/hooks';
import { useMulticallContract } from './useContract';
import ERC20_INTERFACE from '../constants/abis/erc20'
import priceContracts from '../constants/gmePriceContracts'


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
const GME_BUSD_POOL = process.env.REACT_APP_GME_BUSD_POOL || '0x7bd46f6da97312ac2dbd1749f82e202764c0b914'

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

export const useGetPriceDataFromLP = () => {
  const [response] = useMultipleContractSingleData([GME_BUSD_POOL], PAIR_INTERFACE, 'getReserves')
  if (response.loading === false) {
    const result = response.result;
    if (result) {
      const aitReserve = new BigNumber(result[0]._hex)
      const busdReserve = new BigNumber(result[1]._hex)
      const aitUsd = busdReserve.div(aitReserve)
      return aitUsd.toNumber()
    }
  }

  return undefined
}


export default useGetPriceData
