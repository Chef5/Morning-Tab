/*
 * @Author: Chef Wu 
 * @Date: 2023-01-Th 03:22:26 
 * @Last Modified by:   Chef Wu 
 * @Last Modified time: 2023-01-Th 03:22:26 
 */

import storage from './storage.js';

/**
 * @description 存储搜索历史
 * @export
 * @param keyword
 * @returns {*}
 */
export async function storeSearchHistory(keyword) {
  if (!keyword) {
    return false;
  }
  const keywordHistory = await storage.getItemAsync('keywordHistory');
  const keywordList = JSON.parse(keywordHistory || '[]');
  const currentIndex = keywordList.findIndex(d => d === keyword);
  if (currentIndex !== -1) {
    keywordList.splice(currentIndex, 1);
  }
  const historyLengthControl = 1000;
  if (keywordList.length >= historyLengthControl) {
    keywordList.splice(historyLengthControl - 2, keywordList.length - historyLengthControl - 1);
  }
  keywordList.unshift(keyword);
  return await storage.setItem('keywordHistory', JSON.stringify(keywordList || []));
}

/**
 * @description 获取搜索历史
 * @param [length=200] 最近条数，默认最近200条
 * @returns {*}
 */
export async function getSearchHistory(length = 200) {
  const keywordHistory = await storage.getItemAsync('keywordHistory');
  const keywordList = JSON.parse(keywordHistory || '[]');
  return keywordList.slice(0, length);
}

/**
 * @description 删除历史
 * @param [keyword] 删除keyword，不传表示全部删除
 * @returns {*}
 */
export async function deleteSearchHistory(keyword) {
  if (!keyword) {
    return await storage.removeItem('keywordHistory');
  }
  const keywordHistory = await storage.getItemAsync('keywordHistory');
  const keywordList = JSON.parse(keywordHistory || '[]');
  const currentIndex = keywordList.findIndex(d => d === keyword);
  if (currentIndex !== -1) {
    keywordList.splice(currentIndex, 1);
  }
  return await storage.setItem('keywordHistory', JSON.stringify(keywordList || []));
}