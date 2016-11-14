'use strict';

const utils = window.formsafe.utils;
const contentUtils = window.formsafe.contentUtils;

const visibleInputs = Array.from(document.querySelectorAll('input')).filter((elem) => utils.isVisible(elem));
