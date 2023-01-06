/*
 * @Author: Chef Wu 
 * @Date: 2023-01-Th 03:25:14 
 * @Last Modified by:   Chef Wu 
 * @Last Modified time: 2023-01-Th 03:25:14 
 */

// 数据缓存
export default {
  getItem: (key, fn) => {
    chrome.storage.local.get([key], (result) => {
      fn(result[key]);
    });
  },
  getItemAsync: (key) => chrome.storage.local.get(key).then((result) => Promise.resolve(result[key])),
  setItem: (key, value) => chrome.storage.local.set({ [key]: value }),
  removeItem: (key) => chrome.storage.local.remove(key),
};