import {select} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    //console.log(thisWidget.dom.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const  thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);

  }

}

export default DatePicker;
