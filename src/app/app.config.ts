import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ringoffire-12b13","appId":"1:372744712056:web:880c724d893afa5083e28d","storageBucket":"ringoffire-12b13.firebasestorage.app","apiKey":"AIzaSyBm2zyqSWcda0Jr671tpV9zuVthojCWySY","authDomain":"ringoffire-12b13.firebaseapp.com","messagingSenderId":"372744712056"}))), importProvidersFrom(provideDatabase(() => getDatabase())), importProvidersFrom(provideStorage(() => getStorage()))]
};
