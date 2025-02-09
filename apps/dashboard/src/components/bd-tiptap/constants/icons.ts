import type { FunctionalComponent, SVGAttributes } from 'vue'
import mdiAspectRatio from '~icons/mdi/aspect-ratio'
import mdiCheck from '~icons/mdi/check'
import mdiCircle from '~icons/mdi/circle'
import mdiClose from '~icons/mdi/close'
import mdiCodeBracesBox from '~icons/mdi/code-braces-box'
import mdiCodeTags from '~icons/mdi/code-tags'
import mdiDelete from '~icons/mdi/delete'
import mdiFileImagePlus from '~icons/mdi/file-image-plus'
import mdiFormatAlignCenter from '~icons/mdi/format-align-center'
import mdiFormatAlignJustify from '~icons/mdi/format-align-justify'
import mdiFormatAlignLeft from '~icons/mdi/format-align-left'
import mdiFormatAlignRight from '~icons/mdi/format-align-right'
import mdiFormatBold from '~icons/mdi/format-bold'
import mdiFormatClear from '~icons/mdi/format-clear'
import mdiFormatColorHighlight from '~icons/mdi/format-color-highlight'
import mdiFormatFloatLeft from '~icons/mdi/format-float-left'
import mdiFormatFloatNone from '~icons/mdi/format-float-none'
import mdiFormatFloatRight from '~icons/mdi/format-float-right'
import mdiFormatFont from '~icons/mdi/format-font'
import mdiFormatHeader1 from '~icons/mdi/format-header-1'
import mdiFormatHeader2 from '~icons/mdi/format-header-2'
import mdiFormatHeader3 from '~icons/mdi/format-header-3'
import mdiFormatHeader4 from '~icons/mdi/format-header-4'
import mdiFormatHeader5 from '~icons/mdi/format-header-5'
import mdiFormatHeader6 from '~icons/mdi/format-header-6'
import mdiFormatHeaderPound from '~icons/mdi/format-header-pound'
import mdiFormatIndentDecrease from '~icons/mdi/format-indent-decrease'
import mdiFormatIndentIncrease from '~icons/mdi/format-indent-increase'
import mdiFormatItalic from '~icons/mdi/format-italic'
import mdiFormatListBulleted from '~icons/mdi/format-list-bulleted'
import mdiFormatListCheckbox from '~icons/mdi/format-list-checkbox'
import mdiFormatListNumbered from '~icons/mdi/format-list-numbered'
import mdiFormatParagraph from '~icons/mdi/format-paragraph'
import mdiFormatQuoteOpen from '~icons/mdi/format-quote-open'
import mdiFormatSize from '~icons/mdi/format-size'
import mdiFormatStrikethrough from '~icons/mdi/format-strikethrough'
import mdiFormatSubscript from '~icons/mdi/format-subscript'
import mdiFormatSuperscript from '~icons/mdi/format-superscript'
import mdiFormatUnderline from '~icons/mdi/format-underline'
import mdiFullscreen from '~icons/mdi/fullscreen'
import mdiFullscreenExit from '~icons/mdi/fullscreen-exit'
import mdiImagePlus from '~icons/mdi/image-plus'
import mdiLinkVariantOff from '~icons/mdi/link-variant-off'
import mdiLinkVariantPlus from '~icons/mdi/link-variant-plus'
import mdiMinus from '~icons/mdi/minus'
import mdiOpenInNew from '~icons/mdi/open-in-new'
import mdiPalette from '~icons/mdi/palette'
import mdiRedo from '~icons/mdi/redo'
import mdiSizeL from '~icons/mdi/size-l'
import mdiSizeM from '~icons/mdi/size-m'
import mdiSizeS from '~icons/mdi/size-s'
import mdiTable from '~icons/mdi/table'
import mdiTableColumnPlusAfter from '~icons/mdi/table-column-plus-after'
import mdiTableColumnPlusBefore from '~icons/mdi/table-column-plus-before'
import mdiTableColumnRemove from '~icons/mdi/table-column-remove'
import mdiTableMergeCells from '~icons/mdi/table-merge-cells'
import mdiTablePlus from '~icons/mdi/table-plus'
import mdiTableRemove from '~icons/mdi/table-remove'
import mdiTableRowPlusAfter from '~icons/mdi/table-row-plus-after'
import mdiTableRowPlusBefore from '~icons/mdi/table-row-plus-before'
import mdiTableRowRemove from '~icons/mdi/table-row-remove'
import mdiText from '~icons/mdi/text'
import mdiUndo from '~icons/mdi/undo'
import mdiVideoPlus from '~icons/mdi/video-plus'
import mdiWater from '~icons/mdi/water'

export interface ToolbarIconsOptions {
  bold: string | FunctionalComponent<SVGAttributes>
  italic: string | FunctionalComponent<SVGAttributes>
  underline: string | FunctionalComponent<SVGAttributes>
  strike: string | FunctionalComponent<SVGAttributes>
  color: string | FunctionalComponent<SVGAttributes>
  highlight: string | FunctionalComponent<SVGAttributes>
  heading: string | FunctionalComponent<SVGAttributes>
  textAlign: string | FunctionalComponent<SVGAttributes>
  fontFamily: string | FunctionalComponent<SVGAttributes>
  fontSize: string | FunctionalComponent<SVGAttributes>
  bulletList: string | FunctionalComponent<SVGAttributes>
  orderedList: string | FunctionalComponent<SVGAttributes>
  taskList: string | FunctionalComponent<SVGAttributes>
  indent: string | FunctionalComponent<SVGAttributes>
  outdent: string | FunctionalComponent<SVGAttributes>
  link: string | FunctionalComponent<SVGAttributes>
  fileImagePlus: string | FunctionalComponent<SVGAttributes>
  image: string | FunctionalComponent<SVGAttributes>
  video: string | FunctionalComponent<SVGAttributes>
  table: string | FunctionalComponent<SVGAttributes>
  blockquote: string | FunctionalComponent<SVGAttributes>
  horizontalRule: string | FunctionalComponent<SVGAttributes>
  code: string | FunctionalComponent<SVGAttributes>
  codeBlock: string | FunctionalComponent<SVGAttributes>
  clear: string | FunctionalComponent<SVGAttributes>
  undo: string | FunctionalComponent<SVGAttributes>
  redo: string | FunctionalComponent<SVGAttributes>
  markdownTheme: string | FunctionalComponent<SVGAttributes>
  fullscreen: string | FunctionalComponent<SVGAttributes>
}

export interface IconsOptions extends ToolbarIconsOptions {
  circle: string | FunctionalComponent<SVGAttributes>
  close: string | FunctionalComponent<SVGAttributes>
  fullscreenExit: string | FunctionalComponent<SVGAttributes>
  linkVariant: string | FunctionalComponent<SVGAttributes>
  linkVariantOff: string | FunctionalComponent<SVGAttributes>
  openInNew: string | FunctionalComponent<SVGAttributes>
  formatFloatLeft: string | FunctionalComponent<SVGAttributes>
  formatFloatNone: string | FunctionalComponent<SVGAttributes>
  formatFloatRight: string | FunctionalComponent<SVGAttributes>
  sizeS: string | FunctionalComponent<SVGAttributes>
  sizeM: string | FunctionalComponent<SVGAttributes>
  sizeL: string | FunctionalComponent<SVGAttributes>
  aspectRatio: string | FunctionalComponent<SVGAttributes>
  delete: string | FunctionalComponent<SVGAttributes>
  text: string | FunctionalComponent<SVGAttributes>

  // heading
  h1: string | FunctionalComponent<SVGAttributes>
  h2: string | FunctionalComponent<SVGAttributes>
  h3: string | FunctionalComponent<SVGAttributes>
  h4: string | FunctionalComponent<SVGAttributes>
  h5: string | FunctionalComponent<SVGAttributes>
  h6: string | FunctionalComponent<SVGAttributes>
  p: string | FunctionalComponent<SVGAttributes>

  // textAlign
  left: string | FunctionalComponent<SVGAttributes>
  center: string | FunctionalComponent<SVGAttributes>
  right: string | FunctionalComponent<SVGAttributes>
  justify: string | FunctionalComponent<SVGAttributes>

  // sub and superscript
  subscript: string | FunctionalComponent<SVGAttributes>
  superscript: string | FunctionalComponent<SVGAttributes>

  // table
  tablePlus: string | FunctionalComponent<SVGAttributes>
  tableRemove: string | FunctionalComponent<SVGAttributes>
  tableColumnPlusAfter: string | FunctionalComponent<SVGAttributes>
  tableColumnPlusBefore: string | FunctionalComponent<SVGAttributes>
  tableColumnRemove: string | FunctionalComponent<SVGAttributes>
  tableRowPlusAfter: string | FunctionalComponent<SVGAttributes>
  tableRowPlusBefore: string | FunctionalComponent<SVGAttributes>
  tableRowRemove: string | FunctionalComponent<SVGAttributes>
  tableMergeCells: string | FunctionalComponent<SVGAttributes>

  check: string | FunctionalComponent<SVGAttributes>
}

const icons: IconsOptions = {
  bold: mdiFormatBold,
  italic: mdiFormatItalic,
  underline: mdiFormatUnderline,
  strike: mdiFormatStrikethrough,
  color: mdiWater,
  highlight: mdiFormatColorHighlight,
  heading: mdiFormatHeaderPound,
  textAlign: mdiFormatAlignCenter,
  fontFamily: mdiFormatFont,
  fontSize: mdiFormatSize,
  subscript: mdiFormatSubscript,
  superscript: mdiFormatSuperscript,
  bulletList: mdiFormatListBulleted,
  orderedList: mdiFormatListNumbered,
  taskList: mdiFormatListCheckbox,
  indent: mdiFormatIndentIncrease,
  outdent: mdiFormatIndentDecrease,
  link: mdiLinkVariantPlus,
  fileImagePlus: mdiFileImagePlus,
  image: mdiImagePlus,
  video: mdiVideoPlus,
  table: mdiTable,
  blockquote: mdiFormatQuoteOpen,
  horizontalRule: mdiMinus,
  code: mdiCodeTags,
  codeBlock: mdiCodeBracesBox,
  clear: mdiFormatClear,
  undo: mdiUndo,
  redo: mdiRedo,
  markdownTheme: mdiPalette,
  fullscreen: mdiFullscreen,

  // heading
  h1: mdiFormatHeader1,
  h2: mdiFormatHeader2,
  h3: mdiFormatHeader3,
  h4: mdiFormatHeader4,
  h5: mdiFormatHeader5,
  h6: mdiFormatHeader6,
  p: mdiFormatParagraph,

  // textAlign
  left: mdiFormatAlignLeft,
  center: mdiFormatAlignCenter,
  right: mdiFormatAlignRight,
  justify: mdiFormatAlignJustify,

  // no tollbar icon
  circle: mdiCircle,
  close: mdiClose,
  fullscreenExit: mdiFullscreenExit,
  linkVariant: mdiLinkVariantPlus,
  linkVariantOff: mdiLinkVariantOff,
  openInNew: mdiOpenInNew,
  formatFloatLeft: mdiFormatFloatLeft,
  formatFloatNone: mdiFormatFloatNone,
  formatFloatRight: mdiFormatFloatRight,
  sizeS: mdiSizeS,
  sizeM: mdiSizeM,
  sizeL: mdiSizeL,
  aspectRatio: mdiAspectRatio,
  delete: mdiDelete,
  text: mdiText,

  // table
  tablePlus: mdiTablePlus,
  tableRemove: mdiTableRemove,
  tableColumnPlusAfter: mdiTableColumnPlusAfter,
  tableColumnPlusBefore: mdiTableColumnPlusBefore,
  tableColumnRemove: mdiTableColumnRemove,
  tableRowPlusAfter: mdiTableRowPlusAfter,
  tableRowPlusBefore: mdiTableRowPlusBefore,
  tableRowRemove: mdiTableRowRemove,
  tableMergeCells: mdiTableMergeCells,

  check: mdiCheck,
}

export function getIcon(iconName?: keyof IconsOptions): string | undefined {
  if (!iconName)
    return undefined
  return `svg:${icons[iconName]}`
}
