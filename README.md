# AppSwPolitecnica

COMANDOS


DATA STORAGE_________________________________________________________
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic/storage

CAMERA________________________________________________________________
ionic cordova plugin add cordova-plugin-file
npm install @ionic-native/file

SELECT PHOTO OF GALERY_______________________________________________
ionic cordova plugin add cordova-plugin-telerik-imagepicker
npm install @ionic-native/image-picker

 GPS permitir activar__________________________________________________

ionic cordova plugin add cordova-plugin-android-permissions
npm install @ionic-native/android-permissions

 GPS para no salir de la aplicacion________________________________________

ionic cordova plugin add cordova-plugin-request-location-accuracy
npm install @ionic-native/location-accuracy



INICIO/DISENO DEL PROYECTO

ionic start AppPoli blank
ionic g page login
ionic g page register
ionic g page tabs
ionic g page ayuda

ionic g c components/addSubjects
ionic g c components/searchGlobal
ionic g c components/infoMatFavorite
ionic g c components/infoLabSearch
ionic g c components/infoSubjectSearch
ionic g c components/infoTeachSearch
ionic g c components/infoProfileTeach
ionic g c components/showImgComplete
ionic g c components/loadPhoto
ionic g c components/updateInfoUser
ionic g c components/optionsUser

ionic g service services/usuario
ionic g service services/ui-service
ionic g service services/personas = productos
ionic g service services/dataLocal
ionic g service services/loadImage

ionic g pipe pipes/imagen

url.servicios.ts

 
ERRORES_______________________________________________________

La aplicacion crashed y sale "reiniciar la aplicacion" cambiar en:
Plugins/cordova-plugin-telerik-image../plugin.xml
Antes: <framework src="com.android.support:appcompat-v7:23+" />
Despues: <framework src="com.android.support:appcompat-v7:27+" />

- Eliminar la carpeta de platforms/Android
- npm install

--Error: ENOENT: no such file or directory, open
npm run build

--Crashsea el this.data.push()
Se reinicia variables y no te trabaja con el mismo array.

--No muestra valores en el componente HTML
Verificar las variables del ngFor, especialemente el i

--Debug por el USB
Solo realizar el proceso con ionic cordova run android, el prod y el release. Al final, para instalar directamente en el Dispositivo!

