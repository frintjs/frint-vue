/* eslint-disable import/no-extraneous-dependencies, func-names */
/* globals describe, it */
import { expect } from 'chai';

import render from './render';

describe('frint-vue › render', function () {
  it('is a function', function () {
    expect(render).to.be.a('function');
  });
});
