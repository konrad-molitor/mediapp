# MediApp

**MediApp** is an educational project developed for "Laboratorio STEAM" to assist Alzheimer's patients in managing their medication schedules. Caregivers can input pill organizer properties, and the app will help remind patients when to take their medication, with notifications sent to a wearable micro:bit device.

## Features
- Caregiver inputs pill organizer layout.
- Generates a PDF of pill organizer with labeled cells (e.g., A1, A2, B1, B2).
- Caregiver schedules medications in the app.
- Notifies patients when it’s time to take medication.
- Sends reminders to micro:bit device (showing pillbox cell name and beeping).
- Supports multiple languages (English, Spanish, Russian).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/konrad-molitor/mediapp.git
   cd mediapp
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run the app:
   ```bash
   yarn android
   ```

## Technologies Used
- **React Native** for mobile development.
- **micro:bit** for notifications.
- **AsyncStorage** for persisting language preferences.
- **React Navigation** for navigation.
- **Day.js** for date manipulation.
- **FontAwesome** for icons.

## Language Support
This app supports three languages:
- English
- Español
- Русский

## License
This project is licensed under the MIT License.

---

# MediApp (Español)

**MediApp** es un proyecto educativo desarrollado para "Laboratorio STEAM" con el objetivo de ayudar a los pacientes con Alzheimer a gestionar sus horarios de medicación. Los cuidadores pueden ingresar las propiedades del organizador de pastillas, y la aplicación recordará a los pacientes cuándo tomar su medicación, enviando notificaciones a un dispositivo portátil micro:bit.

## Características
- El cuidador ingresa la disposición del organizador de pastillas.
- Genera un archivo PDF del organizador de pastillas con celdas etiquetadas (por ejemplo, A1, A2, B1, B2).
- El cuidador programa las medicinas en la aplicación.
- Notifica a los pacientes cuándo deben tomar su medicación.
- Envía recordatorios al dispositivo micro:bit (mostrando el nombre de la celda y emitiendo un sonido).
- Soporte multilingüe (inglés, español, ruso).

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/konrad-molitor/mediapp.git
   cd mediapp
   ```

2. Instala las dependencias:
   ```bash
   yarn install
   ```

3. Ejecuta la aplicación:
   ```bash
   yarn android
   ```

## Tecnologías Utilizadas
- **React Native** para desarrollo móvil.
- **micro:bit** para notificaciones.
- **AsyncStorage** para la persistencia de preferencias de idioma.
- **React Navigation** para la navegación.
- **Day.js** para la manipulación de fechas.
- **FontAwesome** para los íconos.

## Soporte de Idiomas
Esta aplicación soporta tres idiomas:
- Inglés
- Español
- Ruso

## Licencia
Este proyecto está licenciado bajo la Licencia MIT.
