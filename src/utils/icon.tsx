import {
  // BsFillFolderFill,
  BsFileEarmarkWordFill,
  BsFillFileEarmarkExcelFill,
  BsFillFileEarmarkPptFill,
  BsFillFileEarmarkPdfFill,
  BsFillFileEarmarkPlayFill,
  BsFillFileEarmarkMusicFill,
  BsFillFileEarmarkFontFill,
  BsFillFileEarmarkImageFill,
  BsFillFileEarmarkMinusFill,
} from "react-icons/bs";

import {IoIosFolder} from "react-icons/io";

const getIcon = (type: number, extention: string) => {
  switch (type) {
    case 1:
      return IoIosFolder;
    case 2: {
      if (extention === "doc" || extention === "docx") {
        return BsFileEarmarkWordFill;
      }
      if (extention === "xls" || extention === "xlsx") {
        return BsFillFileEarmarkExcelFill;
      }
      if (extention === "ppt" || extention === "pptx") {
        return BsFillFileEarmarkPptFill;
      } else {
        return BsFillFileEarmarkPdfFill;
      }
    }
    case 3:
      return BsFillFileEarmarkPlayFill;
    case 4:
      return BsFillFileEarmarkMusicFill;
    case 5:
      return BsFillFileEarmarkFontFill;
    case 6:
      return BsFillFileEarmarkImageFill;
    default:
      return BsFillFileEarmarkMinusFill;
  }
};

export default getIcon;
