@echo Combine all js files

java -jar yuicompressor-2.4.7.jar --charset=utf-8 --preserve-semi -o jquery-1.8.3.min.js jquery-1.8.3.js

copy  LocaleUtil.js + bootstrap-alert.js + bootstrap-button.js + bootstrap-carousel.js + bootstrap-collapse.js + Modal.js +jquery.bgiframe.js+xhtml.js+bootstrap-dropdown.js + bootstrap-modal.js + bootstrap-tooltip.js +  bootstrap-popover.js + bootstrap-scrollspy.js + bootstrap-tab.js + bootstrap-transition.js + bootstrap-typeahead.js + google-code-prettify.js + bootstrap-affix.js + bootstrap-datepicker.js + ie.js + SimpleForm.js+base.js + comm.js + jquery.cookie.js + TableUtil.js  app.base.js   /b

java -jar yuicompressor-2.4.7.jar --charset=utf-8 --preserve-semi -o app.min.js app.base.js



copy  home.js  home.base.js   /b
java -jar yuicompressor-2.4.7.jar --charset=utf-8 --preserve-semi -o home.min.js home.base.js
