/* eslint-disable no-unused-vars */
import defaultImage from '../assets/images/placeholder.png';
import PDFICON from '@/assets/images/file-icon-pdf.svg';
import DOCICON from '@/assets/images/file-icon-doc.svg';
import XLSICON from '@/assets/images/file-icon-xls.svg';
import PPTICON from '@/assets/images/file-icon-ppt.svg';
import LINKICON from '@/assets/images/file-icon-link.svg';
import OTHERFILEICON from '@/assets/images/file-icon-other.svg';
const imageType = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
const pdfType = ['pdf'];
const pptType = ['ppt'];
const docType = ['docx', 'doc'];
const excelType = ['xls', 'xlsx'];
const videoType = [
  'mp4',
  'MP4',
  'mpeg4',
  'MPEG4',
  'avi',
  'AVI',
  'mpg',
  'mpeg',
  'MPEG',
  'wmv',
  'WMV',
  'ogg',
  'Ogg',
  'OGG',
  'webm',
  'WebM',
  'WEBM',
  'mov',
  'MOV'
];

export default {
  methods: {
    replaceByDefault(e) {
      e.target.src = defaultImage;
    },
    formatFileName(_name, suffix = '') {
      // the name included file extension
      if (!_name) {
        return 'Unknow';
      }
      const name = String(_name);
      if (name.length < 30) {
        return name + suffix;
      } else {
        return `${name.slice(0, 6)}...${name.slice(-12)}` + suffix;
      }
    },
    getFileIcon(_fileEtx) {
      // the name included file extension
      if (!_fileEtx) {
        return OTHERFILEICON;
      }
      const fileEtx = String(_fileEtx).toLowerCase();

      if (pdfType.includes(fileEtx)) {
        return PDFICON;
      }
      if (docType.includes(fileEtx)) {
        return DOCICON;
      }
      if (excelType.includes(fileEtx)) {
        return XLSICON;
      }
      if (pptType.includes(fileEtx)) {
        return PPTICON;
      }
      return OTHERFILEICON;
    }
  }
};
