import { MenuEntry } from '@gametoken/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: 'http://app.kizunacoin.net',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: '/swap',
      },
      {
        label: 'Liquidity',
        href: '/pool',
      },
    ],
  },
  {
    label: 'Farming',
    icon: 'FarmIcon',
    href: 'http://app.kizunacoin.net/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: 'http://app.kizunacoin.net/pools',
  },
  {
    label: 'GameMarket',
    icon: 'IfoIcon',
    href: 'https://market.gametoken.finance',
  },
  {
    label: 'GameDollar',
    icon: 'IfoIcon',
    href: 'https://gdollar.gametoken.finance',
  },
  {
    label: 'GameVault',
    icon: 'IfoIcon',
    href: 'https://gvault.gametoken.finance',
  },

  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/GameTokenFinance',
      },
      {
        label: 'Docs',
        href: 'https://docs.gametoken.finance/',
      },
      {
        label: 'Blog',
        href: 'https://medium.com/@GameToken',
      },
    ],
  },
]

export default config
