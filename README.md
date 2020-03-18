AirDrawing

#requirements
https://facebook.github.io/react-native/docs/getting-started.html
#installer les modules après téléchargement sur git :
npm i
#regarde les appareils connectés :
adb devices
#debug sur le device connecter :
npx react-native run-android
#Générer .aab avec clé :
https://www.skptricks.com/2019/06/react-native-generate-release-apk-file.html
#Convertir .aab en .apks :
 cd DrawInTheAir 
# 
 java -jar "E:\Temp\bundletool-all-0.6.0.jar" build-apks --bundle="E:\Projects\Android\Temp\app\build\outputs\bundle\debug\app.aab" --output=out_bundle_archive_set.apks
#installation de librairie :
npm install --save react-native-librairie
#
react-native link react-native-librairie
#Modif des librairies ou erreur installation :
 cd android 
# 
gradlew clean

#Icones application
https://stackoverflow.com/questions/34329715/how-to-add-icons-to-react-native-app
