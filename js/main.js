/*
 * @Author: Chef5 
 * @Date: 2021-07-13 21:35:38 
 * @Last Modified by: Chef Wu
 * @Last Modified time: 2023-01-We 05:26:24
 */

import { config } from './config.js';
import { time2cn } from './time2cn.js';
import storage from './storage.js';
import {
  storeSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
} from './historyController.js'

// 模式
const MODES = [
  { key: 'mode', mode: 'coder', name: '程序员模式', label: 'C', tips: '👨‍💻 Switch to Working Mode' },
  { key: 'mode', mode: 'fish', name: '摸鱼', label: 'F', tips: '🐬 Switch to Fishing Mode' },
  { key: 'topic', mode: 'hitokoto', name: '随机一言', label: 'T', tips: 'Hitokoto Topic' },
  { key: 'topic', mode: 'words', name: '随机一词', label: 'W', tips: 'Words Topic' },
];

// 搜索
const doSearch = (type, keyword) => {
  storeSearchHistory(keyword);
  window.location.href = config.href[type] + keyword;
};

// 设置透明度
const setOpacity = (selector, value) => {
  const el = document.querySelector(selector);
  if (el) {
    el.style.opacity = value;
  }
};

const vm = new Vue({
  el: '#vue-root', 
  data: {
    MODES,
    mode: 'coder', // 模式
    keyword: '', // 搜索的词
    topic: 'words',
    // 随机一言\心灵毒鸡汤
    hitokoto: {
      id: '',
      text: 'Hello Dreamers', // tips
      type: '',
      from: '', // from
      creator: '', // author
    },
    words: {
      word: '',
      phonetic: '',
      translation: '',
      definition: '',
    },

    // 搜素历史
    historySetting: false, // 搜索历史设置
    history: [], // 搜索历史
    historyMore: false, // 显示更多

    // C模式
    coder: config.coder || [],
    appDefaultIcon: '/imgs/default.svg',

    // F模式
    showHot: false, // 是否显示热搜
    hotColor: ['#cc3939', '#de6b30', '#cc984f', '#aaa'],
    hot: [
      {
        id: 1,
        logo: './imgs/zhihu.png',
        name: '知乎热榜',
        time: '10分钟前',
        data: [], // { id, link, title, num }
      },
      {
        id: 3,
        logo: './imgs/weibo.png',
        name: '微博热搜',
        time: '10分钟前',
        data: [],
      },
      {
        id: 38,
        logo: './imgs/huxiu.png',
        name: '虎嗅',
        time: '10分钟前',
        data: [],
      },
    ],
  },
  computed: {
    authorInfo: function() {
      return [
        this.hitokoto.from ? `《${this.hitokoto.from}》` : '',
        this.hitokoto.creator ? `by ${this.hitokoto.creator}` : '',
      ].join('');
    },
    translation: function() {
      return this.words.translation.replaceAll('\n', '; ')
    },
    definition: function() {
      return this.words.definition.replaceAll('\n', '; ')
    },
    phonetic: function() {
      return this.words.phonetic ? `/ ${this.words.phonetic} /` : ''
    }
  },
  methods: {
    // 搜索
    search: function(type) {
      doSearch(type, this.keyword);
    },
    // 切换模式
    switchMode: function(key, mode) {
      storage.setItem(key, mode);
      this.initData();
    },
    // 显示内容区
    showBlock: function(selector) {
      this.$nextTick(() => {
        setOpacity(selector, 1);
      });
    },
    // 显示历史开关
    switchHistory: async function() {
      this.historySetting = !this.historySetting;
      if (this.historySetting) {
        this.showBlock('.history');
      }
      await storage.setItem('historySetting', this.historySetting);
    },
    // 获取历史记录
    getHistory: async function() {
      this.history = await getSearchHistory();
      this.showBlock('.history');
    },
    // 显示更多历史
    toggleHistoryMore: function() {
      if (this.historyMore) {
        const el = document.getElementById('history-list');
        el.scrollTop = 0;
      }
      this.historyMore = !this.historyMore;
    },
    // 点击历史记录
    handleHistoryClick: function (item) {
      this.keyword = item;
    },
    // 点击删除历史记录
    handleHistoryClose: async function (item) {
      if (!item) {
        this.historyMore = false;
      }
      await deleteSearchHistory(item);
      this.getHistory();
    },
    // 获取全部热搜
    getHotAll: async function() {
      return axios.get(config.hot.all)
      .then(response => {
        if (response.status === 200 && response.data.data) {
          response.data.data.forEach(item => {
            // 知乎
            if (item.id === this.hot[0].id) {
              this.hot[0].time = time2cn(item.create_time);
              this.hot[0].data = item.data.map(h => ({
                id: h.id,
                link: h.link,
                title: h.title,
                num: h.extra || '',
              }));
            }
            // 微博
            if (item.id === this.hot[1].id) {
              this.hot[1].time = time2cn(item.create_time);
              this.hot[1].data = item.data.map(h => ({
                id: h.id,
                link: h.link,
                title: h.title,
                num: h.extra || '',
              }));
            }
            // 虎嗅
            if (item.id === this.hot[2].id) {
              this.hot[2].time = time2cn(item.create_time);
              this.hot[2].data = item.data.map(h => ({
                id: h.id,
                link: h.link,
                title: h.title,
                num: h.extra || '',
              }));
            }
          });
          this.showHot = true;
          this.showBlock('.fish');
        }
      });
    },
    // 获取单个热搜
    getHotItem: async function(id, index) {
      this.hot[index].time = 'loading...';
      this.hot[index].data = [];
      return axios.get(config.hot.item + id)
      .then(response => {
        if (response.status === 200 && response.data.data) {
          this.hot[index].time = time2cn(response.data.data.time);
          this.hot[index].data = response.data.data.list.map(h => ({
            id: h.id || -1,
            link: h.link,
            title: h.title,
            num: h.extra || '',
          }));
        }
      });
    },
    // 获取随机一言
    getHitokoto: async function() {
      return axios.get(config.hitokoto.api)
      .then(response => {
        if (response.data.isSuccess) {
          this.hitokoto = response.data.data;
        }
      });
    },
    // 获取毒鸡汤
    getSoul: async function() {
      return axios.get(config.soul.api)
      .then(response => {
        if (response.data.isSuccess) {
          this.hitokoto = response.data.data;
        }
      });
    },
    // 获取单词
    getWords: async function() {
      return axios.get(config.words.api)
      .then(response => {
        if (response.data.isSuccess) {
          this.words = response.data.data;
        }
      });
    },
    // 初始化
    initData: async function() {
      // 判断模式
      const mode = await storage.getItemAsync('mode');
      const topic = await storage.getItemAsync('topic');
      this.mode = mode || 'coder';
      this.topic = topic || 'hitokoto';
      if (this.mode === 'coder') {
        this.showBlock('.coder');
      }
      if (this.mode === 'fish') {
        // 获取热搜
        this.getHotAll();
        this.showBlock('.fish');
      }
      this.historySetting = await storage.getItemAsync('historySetting');
      if (this.historySetting) {
        this.showBlock('.history');
      }
      if (this.topic === 'hitokoto') {
        // 1随机一言 0毒鸡汤
        Math.round(Math.random()) ? await this.getHitokoto() : await this.getSoul();
        this.showBlock('.topic');
      }
      if (this.topic === 'words') {
        await this.getWords();
        this.showBlock('.topic');
      }
    }
  }, 
  created: async function() {
    await this.initData();
    await this.getHistory();
    this.showBlock('.coder');
    this.showBlock('.menu');
  },
  mounted: function() {
    
  },
});

// 监听键盘事件
document.onkeydown = (event) => {
  let e = event || window.event || arguments.callee.caller.arguments[0];
  if (e && e.keyCode == 112) { // 按F1 
    event.preventDefault(); // 原F1是chrome帮助
    doSearch('google', vm.keyword)
  }
  if (e && e.keyCode == 113) { // 按F2 
    event.preventDefault();
    doSearch('bing', vm.keyword)
  }
  if (e && e.keyCode == 114 || e.keyCode == 13) { // 按F3和回车
    event.preventDefault();
    doSearch('baidu', vm.keyword)
  }
  if (e && e.keyCode == 115) { // 按F4
    event.preventDefault();
    doSearch('stack', vm.keyword)
  }
};
