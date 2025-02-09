import type { IconOptions } from 'vuetify'
import mdiFacebook from '~icons/mdi/facebook'
import mdiTwitter from '~icons/mdi/twitter'
import mdiWhatsapp from '~icons/mdi/whatsapp'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const icons: IconOptions = {
  defaultSet: 'mdi',
  sets: { mdi },
  aliases: {
    ...aliases,
    'mdi-facebook': mdiFacebook,
    'mdi-twitter': mdiTwitter,
    'mdi-whatsapp': mdiWhatsapp,
  },
}
export default icons
