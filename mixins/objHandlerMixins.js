import { tStr } from 'validation_t/src';
export default {
  methods: {
    previewImg(_listImg, _index) {
      this.$store.commit('setListImagePreview', _listImg);
      this.$store.commit('setSelectedImgIndex', _index);
    },
    returnFieldText(obj, fieldName, replaceStr) {
      if (!obj) {
        return replaceStr;
      }
      if (typeof obj === 'object' && !Array.isArray(obj)) {
        const pastaObj = Object.assign(obj);
        if (Object.prototype.hasOwnProperty.call(pastaObj, fieldName)) {
          return obj[fieldName];
        }
        return replaceStr;
      }
      return replaceStr;
    },
    removeNullistItem(_array = [], field = null, exception = []) {
      if (field) {
        const rslt = _array.filter((o) => {
          if (exception.length) {
            return !!o[field] && !exception.includes(o[field]);
          }
          return !!o[field];
        });
        return rslt;
      } else {
        const rslt = _array.filter((o) => {
          if (exception.length) {
            return !!o && !exception.includes(o);
          }
          return !!o;
        });
        return rslt;
      }
    },
    mergeStringFromField(
      _array = [],
      field,
      joinString = ', ',
      stringWhenEmpty = '',
      endString = ''
    ) {
      if (!_array || !Array.isArray(_array) || !_array.length) {
        return stringWhenEmpty;
      }
      const nArray = _array.map((o) => o[field]);
      const reducer = (previousValue, currentValue) =>
        `${previousValue + joinString + currentValue}`;

      return nArray.reduce(reducer) + endString;
    },
    mergeStringFromFlatArray(
      _array = [],
      joinString = ', ',
      stringWhenEmpty = '',
      endString = ''
    ) {
      if (!_array || !Array.isArray(_array) || !_array.length) {
        return stringWhenEmpty;
      }
      const reducer = (previousValue, currentValue) =>
        `${previousValue + joinString + currentValue}`;

      return _array.reduce(reducer) + endString;
    },
    parseFieldFromArray(
      _array = [],
      field,
      matchValue,
      returnFirstMatch = true
    ) {
      if (!_array || !Array.isArray(_array) || !_array.length) {
        return {};
      }
      const matchList = _array.filter((o) => o[field] === matchValue);

      return returnFirstMatch
        ? matchList && matchList.length
          ? matchList[0]
          : {}
        : matchList;
    },
    highlightMatchText(_query, _stringTarget) {
      if (!_query || !_stringTarget) {
        return _stringTarget;
      }
      const strTargetArr = _stringTarget.split(' ');
      const parsedQuery = String(tStr.removeAscent(_query)).toLowerCase();
      const parsedQueryArr = parsedQuery.split(' ');
      const parsedStringTarget = String(
        tStr.removeAscent(_stringTarget)
      ).toLowerCase();
      const parsedStringTargetArr = parsedStringTarget.split(' ');
      parsedStringTargetArr.forEach((o, i) => {
        if (parsedQueryArr.includes(o)) {
          strTargetArr[
            i
          ] = `<span class="highlight--text">${strTargetArr[i]}</span>`;
        }
      });
      return strTargetArr.join(' ');
    },
    highlightMatchTextNoAscent(_query, _stringTarget) {
      if (!_query || !_stringTarget) {
        return _stringTarget;
      }
      const strTargetArr = _stringTarget.split(' ');
      const parsedQuery = String(tStr.removeAscent(_query)).toLowerCase();
      const parsedQueryArr = parsedQuery.split(' ');
      const parsedStringTarget = String(
        tStr.removeAscent(_stringTarget)
      ).toLowerCase();
      const parsedStringTargetArr = parsedStringTarget.split(' ');
      parsedStringTargetArr.forEach((o, i) => {
        if (parsedQueryArr.some((k) => o.includes(k))) {
          const matchText =
            parsedQueryArr[parsedQueryArr.findIndex((k) => o.includes(k))];
          const startMatchIndex = o.indexOf(matchText);
          const endMatchIndex = startMatchIndex + matchText.length;
          const rm = strTargetArr[i];
          strTargetArr[i] =
            rm.slice(0, startMatchIndex) +
            `<span class="highlight--text font-weight-bold">` +
            rm.slice(startMatchIndex, endMatchIndex) +
            `</span>` +
            rm.slice(endMatchIndex, rm.length);
        }
      });
      return strTargetArr.join(' ');
    },
    matchTextNoAscent(_query, _stringTarget) {
      if (!_query || !_stringTarget) {
        return _stringTarget;
      }
      const parsedQuery = String(tStr.removeAscent(_query))
        .toLowerCase()
        .trim();
      const parsedQueryArr = parsedQuery.split(' ');
      const parsedStringTarget = String(
        tStr.removeAscent(_stringTarget)
      ).toLowerCase();
      const parsedStringTargetArr = parsedStringTarget.split(' ');
      return parsedStringTargetArr.some((o) => {
        return parsedQueryArr.some((k) => o.includes(k));
      });
    }
  }
};
