DrawInTheAir

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
#Modif des librairies :
 cd android 
# 
gradlew clean
