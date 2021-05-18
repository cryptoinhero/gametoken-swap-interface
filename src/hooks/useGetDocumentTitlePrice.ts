import { useEffect } from 'react'
import useGetPriceData, { useGetPriceDataFromLP } from './useGetPriceData'

const useGetDocumentTitlePrice = () => {
  // const priceData = useGetPriceData()
  // const cakePriceUsd = priceData ? parseFloat(priceData.prices.GME) : 0
  const cakePriceUsd = useGetPriceDataFromLP()

  const cakePriceUsdString = !cakePriceUsd
      ? ''
      : ` - $${cakePriceUsd.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}`

  useEffect(() => {
    document.title = `GameTokenFi${cakePriceUsdString}`
  }, [cakePriceUsdString])
}
export default useGetDocumentTitlePrice
