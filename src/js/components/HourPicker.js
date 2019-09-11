/* global rangeSlider */
import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    //console.log('time input:', thisWidget.dom.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    //console.log('time output:', thisWidget.dom.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
    //console.log('value:', thisWidget.value);
  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  parseValue(time) {
    return utils.numberToHour(time);

  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}

export default HourPicker;
