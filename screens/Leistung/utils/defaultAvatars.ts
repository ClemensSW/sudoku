// utils/defaultAvatars.ts
import { ImageSourcePropType } from 'react-native';

// Standard-Avatar für Fallbacks
export const DEFAULT_AVATAR = require('@/assets/images/avatars/default.webp');

export interface DefaultAvatar {
  id: string;
  source: ImageSourcePropType;
  name: string;
  category?: string; // Optional für Kategorisierung
  premium?: boolean; // Neue Eigenschaft: Kennzeichnet Premium-Avatare
}

// Vordefinierte Avatare (hier können einfach mehr hinzugefügt werden)
export const defaultAvatars: DefaultAvatar[] = [
  {
    id: 'default',
    source: DEFAULT_AVATAR,
    name: '', // No name/label shown
    category: 'Cartoon' // Standard avatar only in Cartoon tab
  },
  
  // Cartoons
  {
    id: 'avatar17',
    source: require('@/assets/images/avatars/cartoon/avatar17.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar18',
    source: require('@/assets/images/avatars/cartoon/avatar18.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar19',
    source: require('@/assets/images/avatars/cartoon/avatar19.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar20',
    source: require('@/assets/images/avatars/cartoon/avatar20.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar21',
    source: require('@/assets/images/avatars/cartoon/avatar21.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar22',
    source: require('@/assets/images/avatars/cartoon/avatar22.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar23',
    source: require('@/assets/images/avatars/cartoon/avatar23.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar24',
    source: require('@/assets/images/avatars/cartoon/avatar24.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar25',
    source: require('@/assets/images/avatars/cartoon/avatar25.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar26',
    source: require('@/assets/images/avatars/cartoon/avatar26.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar27',
    source: require('@/assets/images/avatars/cartoon/avatar27.webp'),
    name: '',
    category: 'Cartoon'
  },
    {
    id: 'avatar28',
    source: require('@/assets/images/avatars/cartoon/avatar28.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar29',
    source: require('@/assets/images/avatars/cartoon/avatar29.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar30',
    source: require('@/assets/images/avatars/cartoon/avatar30.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar31',
    source: require('@/assets/images/avatars/cartoon/avatar31.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar32',
    source: require('@/assets/images/avatars/cartoon/avatar32.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar33',
    source: require('@/assets/images/avatars/cartoon/avatar33.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar34',
    source: require('@/assets/images/avatars/cartoon/avatar34.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar35',
    source: require('@/assets/images/avatars/cartoon/avatar35.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar36',
    source: require('@/assets/images/avatars/cartoon/avatar36.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar37',
    source: require('@/assets/images/avatars/cartoon/avatar37.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar38',
    source: require('@/assets/images/avatars/cartoon/avatar38.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar39',
    source: require('@/assets/images/avatars/cartoon/avatar39.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar40',
    source: require('@/assets/images/avatars/cartoon/avatar40.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar41',
    source: require('@/assets/images/avatars/cartoon/avatar41.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar42',
    source: require('@/assets/images/avatars/cartoon/avatar42.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar43',
    source: require('@/assets/images/avatars/cartoon/avatar43.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar44',
    source: require('@/assets/images/avatars/cartoon/avatar44.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar45',
    source: require('@/assets/images/avatars/cartoon/avatar45.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar46',
    source: require('@/assets/images/avatars/cartoon/avatar46.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar47',
    source: require('@/assets/images/avatars/cartoon/avatar47.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar48',
    source: require('@/assets/images/avatars/cartoon/avatar48.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar49',
    source: require('@/assets/images/avatars/cartoon/avatar49.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar50',
    source: require('@/assets/images/avatars/cartoon/avatar50.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar51',
    source: require('@/assets/images/avatars/cartoon/avatar51.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar52',
    source: require('@/assets/images/avatars/cartoon/avatar52.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar53',
    source: require('@/assets/images/avatars/cartoon/avatar53.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar54',
    source: require('@/assets/images/avatars/cartoon/avatar54.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar55',
    source: require('@/assets/images/avatars/cartoon/avatar55.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar56',
    source: require('@/assets/images/avatars/cartoon/avatar56.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar57',
    source: require('@/assets/images/avatars/cartoon/avatar57.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar58',
    source: require('@/assets/images/avatars/cartoon/avatar58.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar59',
    source: require('@/assets/images/avatars/cartoon/avatar59.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar60',
    source: require('@/assets/images/avatars/cartoon/avatar60.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar61',
    source: require('@/assets/images/avatars/cartoon/avatar61.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar62',
    source: require('@/assets/images/avatars/cartoon/avatar62.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar63',
    source: require('@/assets/images/avatars/cartoon/avatar63.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar64',
    source: require('@/assets/images/avatars/cartoon/avatar64.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar65',
    source: require('@/assets/images/avatars/cartoon/avatar65.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar66',
    source: require('@/assets/images/avatars/cartoon/avatar66.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar67',
    source: require('@/assets/images/avatars/cartoon/avatar67.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar68',
    source: require('@/assets/images/avatars/cartoon/avatar68.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar69',
    source: require('@/assets/images/avatars/cartoon/avatar69.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar70',
    source: require('@/assets/images/avatars/cartoon/avatar70.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar71',
    source: require('@/assets/images/avatars/cartoon/avatar71.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar72',
    source: require('@/assets/images/avatars/cartoon/avatar72.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar73',
    source: require('@/assets/images/avatars/cartoon/avatar73.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar74',
    source: require('@/assets/images/avatars/cartoon/avatar74.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar75',
    source: require('@/assets/images/avatars/cartoon/avatar75.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar76',
    source: require('@/assets/images/avatars/cartoon/avatar76.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar77',
    source: require('@/assets/images/avatars/cartoon/avatar77.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar78',
    source: require('@/assets/images/avatars/cartoon/avatar78.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar79',
    source: require('@/assets/images/avatars/cartoon/avatar79.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar80',
    source: require('@/assets/images/avatars/cartoon/avatar80.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar81',
    source: require('@/assets/images/avatars/cartoon/avatar81.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar82',
    source: require('@/assets/images/avatars/cartoon/avatar82.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar83',
    source: require('@/assets/images/avatars/cartoon/avatar83.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar84',
    source: require('@/assets/images/avatars/cartoon/avatar84.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar85',
    source: require('@/assets/images/avatars/cartoon/avatar85.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar86',
    source: require('@/assets/images/avatars/cartoon/avatar86.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar87',
    source: require('@/assets/images/avatars/cartoon/avatar87.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar88',
    source: require('@/assets/images/avatars/cartoon/avatar88.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar89',
    source: require('@/assets/images/avatars/cartoon/avatar89.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar90',
    source: require('@/assets/images/avatars/cartoon/avatar90.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar91',
    source: require('@/assets/images/avatars/cartoon/avatar91.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar92',
    source: require('@/assets/images/avatars/cartoon/avatar92.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar93',
    source: require('@/assets/images/avatars/cartoon/avatar93.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar94',
    source: require('@/assets/images/avatars/cartoon/avatar94.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar95',
    source: require('@/assets/images/avatars/cartoon/avatar95.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar96',
    source: require('@/assets/images/avatars/cartoon/avatar96.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar97',
    source: require('@/assets/images/avatars/cartoon/avatar97.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar98',
    source: require('@/assets/images/avatars/cartoon/avatar98.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar99',
    source: require('@/assets/images/avatars/cartoon/avatar99.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar100',
    source: require('@/assets/images/avatars/cartoon/avatar100.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar101',
    source: require('@/assets/images/avatars/cartoon/avatar101.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar102',
    source: require('@/assets/images/avatars/cartoon/avatar102.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar103',
    source: require('@/assets/images/avatars/cartoon/avatar103.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar104',
    source: require('@/assets/images/avatars/cartoon/avatar104.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar105',
    source: require('@/assets/images/avatars/cartoon/avatar105.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar106',
    source: require('@/assets/images/avatars/cartoon/avatar106.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar107',
    source: require('@/assets/images/avatars/cartoon/avatar107.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar108',
    source: require('@/assets/images/avatars/cartoon/avatar108.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar109',
    source: require('@/assets/images/avatars/cartoon/avatar109.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar110',
    source: require('@/assets/images/avatars/cartoon/avatar110.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar111',
    source: require('@/assets/images/avatars/cartoon/avatar111.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar112',
    source: require('@/assets/images/avatars/cartoon/avatar112.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar113',
    source: require('@/assets/images/avatars/cartoon/avatar113.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar114',
    source: require('@/assets/images/avatars/cartoon/avatar114.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar115',
    source: require('@/assets/images/avatars/cartoon/avatar115.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar116',
    source: require('@/assets/images/avatars/cartoon/avatar116.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar117',
    source: require('@/assets/images/avatars/cartoon/avatar117.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar118',
    source: require('@/assets/images/avatars/cartoon/avatar118.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar119',
    source: require('@/assets/images/avatars/cartoon/avatar119.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar120',
    source: require('@/assets/images/avatars/cartoon/avatar120.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar121',
    source: require('@/assets/images/avatars/cartoon/avatar121.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar122',
    source: require('@/assets/images/avatars/cartoon/avatar122.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar123',
    source: require('@/assets/images/avatars/cartoon/avatar123.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar124',
    source: require('@/assets/images/avatars/cartoon/avatar124.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar125',
    source: require('@/assets/images/avatars/cartoon/avatar125.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar126',
    source: require('@/assets/images/avatars/cartoon/avatar126.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar127',
    source: require('@/assets/images/avatars/cartoon/avatar127.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar128',
    source: require('@/assets/images/avatars/cartoon/avatar128.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar129',
    source: require('@/assets/images/avatars/cartoon/avatar129.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar130',
    source: require('@/assets/images/avatars/cartoon/avatar130.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar131',
    source: require('@/assets/images/avatars/cartoon/avatar131.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar132',
    source: require('@/assets/images/avatars/cartoon/avatar132.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar133',
    source: require('@/assets/images/avatars/cartoon/avatar133.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar134',
    source: require('@/assets/images/avatars/cartoon/avatar134.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar135',
    source: require('@/assets/images/avatars/cartoon/avatar135.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar136',
    source: require('@/assets/images/avatars/cartoon/avatar136.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar137',
    source: require('@/assets/images/avatars/cartoon/avatar137.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar138',
    source: require('@/assets/images/avatars/cartoon/avatar138.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar139',
    source: require('@/assets/images/avatars/cartoon/avatar139.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar140',
    source: require('@/assets/images/avatars/cartoon/avatar140.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar141',
    source: require('@/assets/images/avatars/cartoon/avatar141.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar142',
    source: require('@/assets/images/avatars/cartoon/avatar142.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar143',
    source: require('@/assets/images/avatars/cartoon/avatar143.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar144',
    source: require('@/assets/images/avatars/cartoon/avatar144.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar145',
    source: require('@/assets/images/avatars/cartoon/avatar145.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar146',
    source: require('@/assets/images/avatars/cartoon/avatar146.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar147',
    source: require('@/assets/images/avatars/cartoon/avatar147.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar148',
    source: require('@/assets/images/avatars/cartoon/avatar148.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar149',
    source: require('@/assets/images/avatars/cartoon/avatar149.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar150',
    source: require('@/assets/images/avatars/cartoon/avatar150.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar151',
    source: require('@/assets/images/avatars/cartoon/avatar151.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar152',
    source: require('@/assets/images/avatars/cartoon/avatar152.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar153',
    source: require('@/assets/images/avatars/cartoon/avatar153.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar154',
    source: require('@/assets/images/avatars/cartoon/avatar154.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar155',
    source: require('@/assets/images/avatars/cartoon/avatar155.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar156',
    source: require('@/assets/images/avatars/cartoon/avatar156.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar157',
    source: require('@/assets/images/avatars/cartoon/avatar157.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar158',
    source: require('@/assets/images/avatars/cartoon/avatar158.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar159',
    source: require('@/assets/images/avatars/cartoon/avatar159.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar160',
    source: require('@/assets/images/avatars/cartoon/avatar160.webp'),
    name: '',
    category: 'Cartoon'
  },
  {
    id: 'avatar161',
    source: require('@/assets/images/avatars/cartoon/avatar161.webp'),
    name: '',
    category: 'Cartoon'
  },

  // Anime
  {
    id: 'avatar1',
    source: require('@/assets/images/avatars/anime/avatar1.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar2',
    source: require('@/assets/images/avatars/anime/avatar2.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar3',
    source: require('@/assets/images/avatars/anime/avatar3.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar4',
    source: require('@/assets/images/avatars/anime/avatar4.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar5',
    source: require('@/assets/images/avatars/anime/avatar5.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar6',
    source: require('@/assets/images/avatars/anime/avatar6.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar7',
    source: require('@/assets/images/avatars/anime/avatar7.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar8',
    source: require('@/assets/images/avatars/anime/avatar8.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar9',
    source: require('@/assets/images/avatars/anime/avatar9.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar10',
    source: require('@/assets/images/avatars/anime/avatar10.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar11',
    source: require('@/assets/images/avatars/anime/avatar11.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar12',
    source: require('@/assets/images/avatars/anime/avatar12.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar13',
    source: require('@/assets/images/avatars/anime/avatar13.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar14',
    source: require('@/assets/images/avatars/anime/avatar14.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar15',
    source: require('@/assets/images/avatars/anime/avatar15.webp'),
    name: '',
    category: 'Anime'
  },
  {
    id: 'avatar16',
    source: require('@/assets/images/avatars/anime/avatar16.webp'),
    name: '',
    category: 'Anime'
  },

  // Tiere (Animals)
  {
    id: 'animal1',
    source: require('@/assets/images/avatars/animals/001-elephant.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal2',
    source: require('@/assets/images/avatars/animals/002-snake.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal3',
    source: require('@/assets/images/avatars/animals/003-hippo.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal4',
    source: require('@/assets/images/avatars/animals/004-turtle.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal5',
    source: require('@/assets/images/avatars/animals/005-parrot.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal6',
    source: require('@/assets/images/avatars/animals/006-panda.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal7',
    source: require('@/assets/images/avatars/animals/007-boar.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal8',
    source: require('@/assets/images/avatars/animals/008-giraffe.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal9',
    source: require('@/assets/images/avatars/animals/009-squid.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal10',
    source: require('@/assets/images/avatars/animals/010-rhino.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal11',
    source: require('@/assets/images/avatars/animals/011-deer.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal12',
    source: require('@/assets/images/avatars/animals/012-stingray.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal13',
    source: require('@/assets/images/avatars/animals/013-beetle.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal14',
    source: require('@/assets/images/avatars/animals/014-shark.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal15',
    source: require('@/assets/images/avatars/animals/015-walrus.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal16',
    source: require('@/assets/images/avatars/animals/016-bat.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal17',
    source: require('@/assets/images/avatars/animals/017-hedgehog.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal18',
    source: require('@/assets/images/avatars/animals/018-spider.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal19',
    source: require('@/assets/images/avatars/animals/019-ladybug.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal20',
    source: require('@/assets/images/avatars/animals/020-dog.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal21',
    source: require('@/assets/images/avatars/animals/021-sloth.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal22',
    source: require('@/assets/images/avatars/animals/022-rabbit.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal23',
    source: require('@/assets/images/avatars/animals/023-crab.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal24',
    source: require('@/assets/images/avatars/animals/024-camel.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal25',
    source: require('@/assets/images/avatars/animals/025-zebra.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal26',
    source: require('@/assets/images/avatars/animals/026-beaver.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal27',
    source: require('@/assets/images/avatars/animals/027-horse.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal28',
    source: require('@/assets/images/avatars/animals/028-chicken.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal29',
    source: require('@/assets/images/avatars/animals/029-fox.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal30',
    source: require('@/assets/images/avatars/animals/030-frog.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal31',
    source: require('@/assets/images/avatars/animals/031-platypus.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal32',
    source: require('@/assets/images/avatars/animals/032-whale.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal33',
    source: require('@/assets/images/avatars/animals/033-cow.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal34',
    source: require('@/assets/images/avatars/animals/034-bullfinch.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal35',
    source: require('@/assets/images/avatars/animals/035-butterfly.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal36',
    source: require('@/assets/images/avatars/animals/036-clown fish.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal37',
    source: require('@/assets/images/avatars/animals/037-penguin.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal38',
    source: require('@/assets/images/avatars/animals/038-owl.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal39',
    source: require('@/assets/images/avatars/animals/039-crocodile.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal40',
    source: require('@/assets/images/avatars/animals/040-lama.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal41',
    source: require('@/assets/images/avatars/animals/041-bee.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal42',
    source: require('@/assets/images/avatars/animals/042-chameleon.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal43',
    source: require('@/assets/images/avatars/animals/043-buffalo.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal44',
    source: require('@/assets/images/avatars/animals/044-pig.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal45',
    source: require('@/assets/images/avatars/animals/045-cat.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal46',
    source: require('@/assets/images/avatars/animals/046-sheep.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal47',
    source: require('@/assets/images/avatars/animals/047-flamingo.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal48',
    source: require('@/assets/images/avatars/animals/048-lion.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal49',
    source: require('@/assets/images/avatars/animals/049-gorilla.png'),
    name: '',
    category: 'Tiere'
  },
  {
    id: 'animal50',
    source: require('@/assets/images/avatars/animals/050-mouse.png'),
    name: '',
    category: 'Tiere'
  },

];

// Gruppiere Avatare nach Kategorien
export const getAvatarsByCategory = (): Record<string, DefaultAvatar[]> => {
  const categories: Record<string, DefaultAvatar[]> = {};
  
  defaultAvatars.forEach(avatar => {
    const category = avatar.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(avatar);
  });
  
  return categories;
};

// Avatar anhand der ID finden
export const getAvatarById = (id: string): DefaultAvatar | undefined => {
  return defaultAvatars.find(avatar => avatar.id === id);
};

// Funktionen zur Verwaltung der Pfade zu vordefinierten Avataren
export const isDefaultAvatarPath = (path: string | null | undefined): boolean => {
  return Boolean(path && path.startsWith('default://'));
};

export const getDefaultAvatarPath = (id: string): string => {
  return `default://${id}`;
};

export const getAvatarIdFromPath = (path: string | null | undefined): string | null => {
  if (isDefaultAvatarPath(path)) {
    return path!.replace('default://', '');
  }
  return null;
};

/**
 * Konvertiert einen Avatar-URI (egal ob Datei oder vordefinierter Avatar) in eine Image-Source
 */
export const getAvatarSourceFromUri = (
  uri: string | null | undefined,
  defaultSource: ImageSourcePropType
): ImageSourcePropType => {
  if (!uri) {
    return defaultSource;
  }
  
  // Prüfen ob es ein vordefinierter Avatar ist
  if (isDefaultAvatarPath(uri)) {
    const avatarId = getAvatarIdFromPath(uri);
    if (avatarId) {
      const defaultAvatar = getAvatarById(avatarId);
      if (defaultAvatar) {
        return defaultAvatar.source;
      }
    }
    return defaultSource;
  }
  
  // Normaler Datei-URI
  return { uri };
};