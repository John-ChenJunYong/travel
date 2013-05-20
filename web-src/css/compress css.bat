@echo Combine all js files
copy  bootstrap.css + bootstrap-fixed.css + bootstrap-datepicker.css + simpleform.css + style.css + modal.css   app.base.css   /b
java -jar yuicompressor-2.4.7.jar --charset=utf-8 --type=css  -o app.min.css app.base.css


copy  ie.css  ie.base.css   /b
java -jar yuicompressor-2.4.7.jar --charset=utf-8 --type=css -o ie.min.css ie.base.css

copy  bootstrap-responsive.css + style-responsive.css  app-responsive.base.css   /b
java -jar yuicompressor-2.4.7.jar --charset=utf-8 --type=css -o app-responsive.min.css app-responsive.base.css
