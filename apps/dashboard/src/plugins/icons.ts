import type { IconOptions } from 'vuetify'
import { mdi } from 'vuetify/iconsets/mdi'
import epFiles from '~icons/ep/files'
import faSolidIndent from '~icons/fa-solid/indent'
import faSolidOutdent from '~icons/fa-solid/outdent'
import FluentMdl2LocaleLanguage from '~icons/fluent-mdl2/locale-language'
import fluentFontDecrease20Filled from '~icons/fluent/font-decrease-20-filled'
import fluentFontIncrease20Filled from '~icons/fluent/font-increase-20-filled'
import fluentLayoutColumnThreeFocusLeft24Filled from '~icons/fluent/layout-column-three-focus-left-24-filled'
import fluentLayoutColumnTwoFocusLeft24Filled from '~icons/fluent/layout-column-two-focus-left-24-filled'
import fluentRectangleLandscape24Filled from '~icons/fluent/rectangle-landscape-24-filled'
import mdiAccount from '~icons/mdi/account'
import mdiAlertCircle from '~icons/mdi/alert-circle'
import mdiArrowCollapseHorizontal from '~icons/mdi/arrow-collapse-horizontal'
import mdiArrowDown from '~icons/mdi/arrow-down'
import mdiArrowDownBold from '~icons/mdi/arrow-down-bold'
import mdiArrowExpandHorizontal from '~icons/mdi/arrow-expand-horizontal'
import mdiArrowUp from '~icons/mdi/arrow-up'
import mdiCached from '~icons/mdi/cached'
import mdiCalendar from '~icons/mdi/calendar'
import mdiCarElectric from '~icons/mdi/car-electric'
import mdiCellphone from '~icons/mdi/cellphone'
import mdiCheck from '~icons/mdi/check'
import mdiCheckCircle from '~icons/mdi/check-circle'
import mdiCheckboxBlank from '~icons/mdi/checkbox-blank'
import mdiCheckboxBlankOutline from '~icons/mdi/checkbox-blank-outline'
import mdiCheckboxMarked from '~icons/mdi/checkbox-marked'
import mdiCheckboxMultipleBlankCircleOutline from '~icons/mdi/checkbox-multiple-blank-circle-outline'
import mdiChevronDoubleLeft from '~icons/mdi/chevron-double-left'
import mdiChevronDoubleRight from '~icons/mdi/chevron-double-right'
import mdiChevronDown from '~icons/mdi/chevron-down'
import mdiChevronLeft from '~icons/mdi/chevron-left'
import mdiChevronRight from '~icons/mdi/chevron-right'
import mdiChevronUp from '~icons/mdi/chevron-up'
import mdiCircle from '~icons/mdi/circle'
import mdiClose from '~icons/mdi/close'
import mdiCloseCircle from '~icons/mdi/close-circle'
import mdiCloudUpload from '~icons/mdi/cloud-upload'
import mdiCodeTags from '~icons/mdi/code-tags'
import mdiCog from '~icons/mdi/cog'
import mdiDelete from '~icons/mdi/delete'
import mdiDotsVertical from '~icons/mdi/dots-vertical'
import mdiDrag from '~icons/mdi/drag'
import mdiEarth from '~icons/mdi/earth'
import mdiEye from '~icons/mdi/eye'
import mdiEyeOff from '~icons/mdi/eye-off'
import mdiEyedropper from '~icons/mdi/eyedropper'
import mdiFacebook from '~icons/mdi/facebook'
import mdiFileDocument from '~icons/mdi/file-document'
import mdiFilter from '~icons/mdi/filter'
import mdiFolder from '~icons/mdi/folder'
import mdiFormatAlignCenter from '~icons/mdi/format-align-center'
import mdiFormatAlignJustify from '~icons/mdi/format-align-justify'
import mdiFormatAlignLeft from '~icons/mdi/format-align-left'
import mdiFormatAlignRight from '~icons/mdi/format-align-right'
import mdiFormatBold from '~icons/mdi/format-bold'
import mdiFormatClear from '~icons/mdi/format-clear'
import mdiFormatColor from '~icons/mdi/format-color'
import mdiFormatColorFill from '~icons/mdi/format-color-fill'
import mdiFormatFont from '~icons/mdi/format-font'
import mdiFormatHeader1 from '~icons/mdi/format-header-1'
import mdiFormatHeader2 from '~icons/mdi/format-header-2'
import mdiFormatHeader3 from '~icons/mdi/format-header-3'
import mdiFormatIndentDecrease from '~icons/mdi/format-indent-decrease'
import mdiFormatIndentIncrease from '~icons/mdi/format-indent-increase'
import mdiFormatItalic from '~icons/mdi/format-italic'
import mdiFormatListBulleted from '~icons/mdi/format-list-bulleted'
import mdiFormatListNumbered from '~icons/mdi/format-list-numbered'
import mdiFormatListText from '~icons/mdi/format-list-text'
import mdiFormatParagraph from '~icons/mdi/format-paragraph'
import mdiFormatQuoteClose from '~icons/mdi/format-quote-close'
import mdiFormatStrikethrough from '~icons/mdi/format-strikethrough'
import mdiFormatSubscript from '~icons/mdi/format-subscript'
import mdiFormatSuperscript from '~icons/mdi/format-superscript'
import mdiFormatUnderline from '~icons/mdi/format-underline'
import mdiGear from '~icons/mdi/gear'
import mdiGeneratorPortable from '~icons/mdi/generator-portable'
import mdiGrid from '~icons/mdi/grid'
import mdiGroup from '~icons/mdi/group'
import mdiImagePlus from '~icons/mdi/image-plus'
import mdiInformation from '~icons/mdi/information'
import mdiInformationOutline from '~icons/mdi/information-outline'
import mdiKey from '~icons/mdi/key'
import mdiLightbulb from '~icons/mdi/lightbulb'
import mdiLinkVariant from '~icons/mdi/link-variant'
import mdiLinkVariantOff from '~icons/mdi/link-variant-off'
import mdiLinkVariantPlus from '~icons/mdi/link-variant-plus'
import mdiLogout from '~icons/mdi/logout'
import mdiMagnify from '~icons/mdi/magnify'
import mdiMenu from '~icons/mdi/menu'
import mdiMenuDown from '~icons/mdi/menu-down'
import mdiMenuRight from '~icons/mdi/menu-right'
import mdiMinus from '~icons/mdi/minus'
import mdiMinusBox from '~icons/mdi/minus-box'
import mdiNewspaper from '~icons/mdi/newspaper'
import mdiPageFirst from '~icons/mdi/page-first'
import mdiPageLast from '~icons/mdi/page-last'
import mdiPaperclip from '~icons/mdi/paperclip'
import mdiPencil from '~icons/mdi/pencil'
import mdiPencilRuler from '~icons/mdi/pencil-ruler'
import mdiPlus from '~icons/mdi/plus'
import mdiPlusCircleMultipleOutline from '~icons/mdi/plus-circle-multiple-outline'
import mdiPump from '~icons/mdi/pump'
import mdiRadioboxBlank from '~icons/mdi/radiobox-blank'
import mdiRadioboxMarked from '~icons/mdi/radiobox-marked'
import mdiRedo from '~icons/mdi/redo'
import mdiReload from '~icons/mdi/reload'
import mdiRestore from '~icons/mdi/restore'
import mdiShape from '~icons/mdi/shape'
import mdiSofa from '~icons/mdi/sofa'
import mdiSolarPanel from '~icons/mdi/solar-panel'
import mdiSolarPanelLarge from '~icons/mdi/solar-panel-large'
import mdiStar from '~icons/mdi/star'
import mdiStarHalfFull from '~icons/mdi/star-half-full'
import mdiStarOutline from '~icons/mdi/star-outline'
import mdiTag from '~icons/mdi/tag'
import mdiToggleSwitch from '~icons/mdi/toggle-switch'

import mdiTractor from '~icons/mdi/tractor'
import mdiTranslate from '~icons/mdi/translate'
import mdiTrashCan from '~icons/mdi/trash-can'

import mdiTwitter from '~icons/mdi/twitter'
import mdiUndo from '~icons/mdi/undo'
import mdiUnfoldMoreHorizontal from '~icons/mdi/unfold-more-horizontal'

import mdiViewDashboard from '~icons/mdi/view-dashboard'

import mdiViewGrid from '~icons/mdi/view-grid'
import mdiViewGridPlus from '~icons/mdi/view-grid-plus'

import mdiViewList from '~icons/mdi/view-list'

import mdiWashingMachine from '~icons/mdi/washing-machine'

import mdiWhatsapp from '~icons/mdi/whatsapp'

import openmojiMotor from '~icons/openmoji/motor'
import tablerCircuitMotor from '~icons/tabler/circuit-motor'

const icons: IconOptions = {
  defaultSet: 'mdi',
  sets: { mdi },
  aliases: {
    'dropdown': mdiMenuDown,
    'unfold': mdiUnfoldMoreHorizontal,
    'eyeDropper': mdiEyedropper,
    'clear': mdiClose,
    'mdi-group': mdiGroup,
    'mdi-filter': mdiFilter,
    'mdi-close': mdiClose,
    'mdi-star': mdiStar,
    'ep-files': epFiles,
    'fluent-mdl2-locale-language': FluentMdl2LocaleLanguage,
    'mdi-account': mdiAccount,
    'mdi-car-electric': mdiCarElectric,
    'mdi-drag': mdiDrag,
    'mdi-cellphone': mdiCellphone,
    'mdi-checkbox-blank-outline': mdiCheckboxBlankOutline,
    'mdi-restore': mdiRestore,
    'checkboxOff': mdiCheckboxBlankOutline,
    'mdi-checkbox-marked': mdiCheckboxMarked,
    'checkboxOn': mdiCheckboxMarked,
    'mdi-checkbox-multiple-blank-circle-outline': mdiCheckboxMultipleBlankCircleOutline,
    'mdi-chevron-double-left': mdiChevronDoubleLeft,
    'mdi-chevron-double-right': mdiChevronDoubleRight,
    'mdi-chevron-down': mdiChevronDown,
    'mdi-chevron-left': mdiChevronLeft,
    'mdi-chevron-right': mdiChevronRight,
    'mdi-chevron-up': mdiChevronUp,
    'mdi-delete': mdiDelete,
    'mdi-eye': mdiEye,
    'mdi-eye-off': mdiEyeOff,
    'mdi-facebook': mdiFacebook,
    'mdi-folder': mdiFolder,
    'mdi-generator-portable': mdiGeneratorPortable,
    'mdi-grid': mdiGrid,
    'mdi-information-outline': mdiInformationOutline,
    'mdi-key': mdiKey,
    'mdi-lightbulb': mdiLightbulb,
    'mdi-logout': mdiLogout,
    'mdi-magnify': mdiMagnify,
    'mdi-minus-box': mdiMinusBox,
    'mdi-pencil': mdiPencil,
    'mdi-plus': mdiPlus,
    'mdi-pump': mdiPump,
    'mdi-toggle-switch': mdiToggleSwitch,
    'mdi-radio-off': mdiRadioboxBlank,
    'mdi-radiobox-marked': mdiRadioboxMarked,
    'mdi-radio-on': mdiRadioboxMarked,
    'radioOn': mdiRadioboxMarked,
    'radioOff': mdiRadioboxBlank,
    'mdi-pencil-ruler': mdiPencilRuler,
    'mdi-reload': mdiReload,
    'mdi-sofa': mdiSofa,
    'mdi-solar-panel': mdiSolarPanel,
    'mdi-solar-panel-large': mdiSolarPanelLarge,
    'mdi-tractor': mdiTractor,
    'mdi-trash-can': mdiTrashCan,
    'mdi-twitter': mdiTwitter,
    'mdi-washing-machine': mdiWashingMachine,
    'mdi-whatsapp': mdiWhatsapp,
    'openmoji-motor': openmojiMotor,
    'tabler-circuit-motor': tablerCircuitMotor,
    'mdi-close-circle': mdiCloseCircle,
    'delete': mdiClose,
    'mdi-earth': mdiEarth,
    'mdi-gear': mdiGear,
    'mdi-format-bold': mdiFormatBold,
    'mdi-format-italic': mdiFormatItalic,
    'mdi-format-strikethrough': mdiFormatStrikethrough,
    'mdi-code-tags': mdiCodeTags,
    'mdi-format-paragraph': mdiFormatParagraph,
    'mdi-format-header-1': mdiFormatHeader1,
    'mdi-format-header-2': mdiFormatHeader2,
    'mdi-format-header-3': mdiFormatHeader3,
    'mdi-format-list-bulleted': mdiFormatListBulleted,
    'mdi-format-list-numbered': mdiFormatListNumbered,
    'mdi-format-quote-close': mdiFormatQuoteClose,
    'mdi-minus': mdiMinus,
    'mdi-undo': mdiUndo,
    'mdi-redo': mdiRedo,
    'fluent-font-increase-20-filled': fluentFontIncrease20Filled,
    'fluent-font-decrease-20-filled': fluentFontDecrease20Filled,
    'mdi-format-underline': mdiFormatUnderline,
    'mdi-format-subscript': mdiFormatSubscript,
    'mdi-format-superscript': mdiFormatSuperscript,
    'mdi-format-color': mdiFormatColor,
    'mdi-format-color-fill': mdiFormatColorFill,
    'mdi-format-indent-increase': mdiFormatIndentIncrease,
    'mdi-format-indent-decrease': mdiFormatIndentDecrease,
    'mdi-format-align-left': mdiFormatAlignLeft,
    'mdi-format-align-center': mdiFormatAlignCenter,
    'mdi-format-align-right': mdiFormatAlignRight,
    'mdi-format-align-justify': mdiFormatAlignJustify,
    'mdi-arrow-down-bold': mdiArrowDownBold,
    'mdi-link-variant-off': mdiLinkVariantOff,
    'mdi-link-variant-plus': mdiLinkVariantPlus,
    'mdi-format-font': mdiFormatFont,
    'mdi-image-plus': mdiImagePlus,
    'mdi-link-variant': mdiLinkVariant,
    'mdi-format-clear': mdiFormatClear,
    'mdi-checkbox-blank': mdiCheckboxBlank,
    'mdi-circle': mdiCircle,
    'mdi-check': mdiCheck,
    'mdi-dots-vertical': mdiDotsVertical,
    'fa-solid-indent': faSolidIndent,
    'fa-solid-outdent': faSolidOutdent,
    'mdi-translate': mdiTranslate,
    'mdi-cog': mdiCog,
    'mdi-view-dashboard': mdiViewDashboard,
    'mdi-view-grid': mdiViewGrid,
    'mdi-view-grid-plus': mdiViewGridPlus,
    'mdi-view-list': mdiViewList,
    'mdi-file-document': mdiFileDocument,
    'mdi-shape': mdiShape,
    'mdi-newspaper': mdiNewspaper,
    'mdi-tag': mdiTag,
    'mdi-plus-circle-multiple-outline': mdiPlusCircleMultipleOutline,
    'fluent-rectangle-landscape-24-filled': fluentRectangleLandscape24Filled,
    'fluent-layout-column-two-focus-left-24-filled': fluentLayoutColumnTwoFocusLeft24Filled,
    'fluent-layout-column-three-focus-left-24-filled': fluentLayoutColumnThreeFocusLeft24Filled,
    'collapse': mdiChevronUp,
    'complete': mdiCheck,
    'cancel': mdiCloseCircle,
    'close': mdiClose,

    'success': mdiCheckCircle,
    'info': mdiInformation,
    'warning': mdiAlertCircle,
    'error': mdiCloseCircle,
    'prev': mdiChevronLeft,
    'next': mdiChevronRight,

    'checkboxIndeterminate': mdiMinusBox,
    'delimiter': mdiCircle,
    'sortAsc': mdiArrowUp,
    'sortDesc': mdiArrowDown,
    'expand': mdiChevronDown,
    'menu': mdiMenu,
    'subgroup': mdiMenuDown,

    'edit': mdiPencil,
    'ratingEmpty': mdiStarOutline,
    'ratingFull': mdiStar,
    'ratingHalf': mdiStarHalfFull,
    'loading': mdiCached,
    'first': mdiPageFirst,
    'last': mdiPageLast,
    'file': mdiPaperclip,
    'plus': mdiPlus,
    'minus': mdiMinus,
    'calendar': mdiCalendar,
    'treeviewCollapse': mdiMenuDown,
    'treeviewExpand': mdiMenuRight,
    'upload': mdiCloudUpload,

    'mdi-arrow-expand-horizontal': mdiArrowExpandHorizontal,
    'mdi-arrow-collapse-horizontal': mdiArrowCollapseHorizontal,

    'mdi-format-list-text': mdiFormatListText,
  },
}
const aliases = Object.keys(icons.aliases!)
export default icons

const randomIcon = () => `$${aliases[Math.floor(Math.random() * aliases.length)] ?? 'mdi-exclamation'}`
export { aliases, randomIcon }
