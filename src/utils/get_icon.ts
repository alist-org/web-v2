import { FileProps } from "@/store"
import { categorys, fileExtensions } from "./const"

export const getIcon = (record: FileProps) => {
  if (record.type=='folder'){
    return 'folder'
  }
  if (Object.prototype.hasOwnProperty.call(fileExtensions,record.file_extension)){
    return fileExtensions[record.file_extension]
  }
  if (Object.prototype.hasOwnProperty.call(categorys,record.category)){
    return categorys[record.category]
  }
  return 'file'
}
