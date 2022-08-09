import { tDate } from 'validation_t/src';

export const dateDMYToYMD = (_date) => {
  // _date: 22-04-2022

  if (!_date) {
    return '';
  }
  const arrDate = _date.split('-');
  return `${arrDate[2]}-${arrDate[1]}-${arrDate[0]}`;
};
export const dateYMDToDMY = (_date) => {
  // _date: 2022-04-22

  if (!_date) {
    return '';
  }
  const arrDate = _date.split('-');
  return `${arrDate[2]}-${arrDate[1]}-${arrDate[0]}`;
};
export const formatDateDMYH = (_date) => {
  // _date: 2022-04-22T16:47:00
  if (!_date) {
    return '';
  }
  const objDate = tDate.formatDateCustomize(_date);
  return `${objDate.dd}/${objDate.MM}/${objDate.yyyy} lúc ${objDate.hh}:${objDate.mm}`;
};
export const formatDateHMDMY = (_date) => {
  // _date: 2022-04-22T16:47:00
  if (!_date) {
    return '';
  }
  const objDate = tDate.formatDateCustomize(_date);
  return `${objDate.hh}:${objDate.mm} ${objDate.dd}/${objDate.MM}/${objDate.yyyy}`;
};
export const formatDateHMDM = (_date) => {
  // _date: 2022-04-22T16:47:00
  if (!_date) {
    return '';
  }
  const objDate = tDate.formatDateCustomize(_date);
  return `${objDate.hh}:${objDate.mm} | ${objDate.dd}/${objDate.MM}`;
};
export const formatDateDMY = (_date) => {
  // _date: 2022-04-22T16:47:00
  if (!_date) {
    return '';
  }
  const objDate = tDate.formatDateCustomize(_date);
  return `${objDate.dd}/${objDate.MM}/${objDate.yyyy}`;
};
export const convertTimeRv = (lastLogin) => {
  const minutes = 60;
  const hours = 60 * 60;
  const days = 60 * 60 * 24;

  const now = Math.floor(new Date().getTime() / 1000);
  const _lastLogin = Math.floor(new Date(lastLogin).getTime() / 1000);

  const sub = now - _lastLogin;

  if (sub < minutes) return '1 phút trước';
  if (sub < hours) {
    const _minutes = Math.floor(sub / minutes);
    return `${_minutes} phút trước`;
  }
  if (sub < days) {
    const _hours = Math.floor(sub / hours);
    return `${_hours} giờ trước`;
  }

  const _days = Math.floor(sub / days);
  return `${_days} ngày trước`;
};
