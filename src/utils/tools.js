/*
 *  Copyright (c) 2023 Archie - Sprout Digital Labs.
 *  All rights reserved.
 */

'use script';

function normalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map((s) => (s.length >= 2 ? s.charAt(0).toUpperCase() + s.substring(1) : s.toUpperCase()))
    .join(' ');
}

function leadingUppercaseText(str) {
  let text = str
    .toLowerCase()
    .split(' ')
    .map((s) => (s.length >= 5 ? s.charAt(0).toUpperCase() + s.substring(1) : s.toUpperCase()))
    .join(' ');
  text = text.replace(/bank/i, 'Bank');
  text = text.replace(/kec/i, 'Kec');
  text = text.replace(/kel/i, 'Kel');
  text = text.replace(/kab/i, 'Kab');
  return text;
}

function wordsLength(str) {
  const array = str.trim().split(/\s+/);
  return array.length;
}

function normalizePhone(phone) {
  const numberOnly = phone.replace(/[^\d]/, '');
  const pattern = new RegExp(/^(0|62)/);

  const phoneLeader = numberOnly.match(pattern);

  if (phoneLeader) {
    return numberOnly.replace(phoneLeader[0], '');
  }

  return numberOnly;
}

module.exports = {
  normalizeName,
  leadingUppercaseText,
  wordsLength,
  normalizePhone,
};
