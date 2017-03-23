# FTC Web App
This is used to compile into the HTML part of FTChinese' iOS and Android app. 

# Install
git clone https://github.com/FTChinese/webapp.git
cd webapp
npm install & bower install

# If you are in China
npm install will fail for node-sass, run the following command: 
## SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install
## https://segmentfault.com/a/1190000005921721
## Or better, use taobao for npm and gem source

# develop and preview
gulp serve

# publish
gulp copy
gulp publish

# Use the code in iOS and Android apps
copy the generated HTML file manually and paste into Xcode and Android Studio projects. 

# note
In order for the gulp copy and gulp publish to work properly. You need to put dev_www and testing under the same folder of webapp. 

