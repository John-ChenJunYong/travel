@echo Combine all js files
copy  editor_config.js + editor_all.js     editor.js   /b

java -jar yuicompressor-2.4.7.jar --charset=utf-8 --preserve-semi -o editor.min.js  editor.js