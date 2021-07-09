import { getUrl } from "./get_url"

export const VERSION = 'v1.0.6'

export const fileExtensions: { [key: string]: string } = {
  exe: 'windows',
  xls: 'file-excel',
  xlsx: 'file-excel',
  md: 'file-markdown',
  pdf: 'file-pdf',
  ppt: 'file-ppt',
  pptx: 'file-ppt',
  doc: 'file-word',
  docx: 'file-word',
  // jpg:'file-jpg',
  zip: 'file-zip',
  gz: 'file-zip',
  rar: 'file-zip',
  "7z": 'file-zip',
  tar: 'file-zip',
  jar: 'file-zip',
  xz: 'file-zip',
  apk: 'android',
  dmg: 'apple',
  ipa: 'apple',
  m3u8: 'youtube',
}

export const doc = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']

export const categorys: { [key: string]: string } = {
  image: 'file-image',
  doc: 'file-text',
  video: 'youtube',
  audio: 'customer-service',
}

export const backendUrl: string = process.env.VUE_APP_API_URL != '/' ? process.env.VUE_APP_API_URL : getUrl('')
