import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
configure({ asyncUtilTimeout: 10000 });

global.describe = global.describe || require('jest').describe;
global.it = global.it || require('jest').it;
global.expect = global.expect || require('jest').expect;
global.test = global.test || require('jest').test;
global.beforeEach = global.beforeEach || require('jest').beforeEach;
global.afterEach = global.afterEach || require('jest').afterEach;
global.jest = global.jest || require('jest');

delete window.location;
window.location = {
  search: '',
  pathname: '/',
  href: 'http://localhost',
  assign: vi.fn(),
  replace: vi.fn()
};

global.URLSearchParams = class URLSearchParams {
  constructor(init) {
    this.params = new Map();
    if (typeof init === 'string') {
      init.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          this.params.set(key, value || '');
        }
      });
    }
  }

  get(name) {
    return this.params.get(name);
  }

  set(name, value) {
    this.params.set(name, value);
  }

  delete(name) {
    this.params.delete(name);
  }

  toString() {
    return Array.from(this.params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
};
