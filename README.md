# To-Do List (Ionic + Angular + Cordova)

Aplicación móvil de gestión de tareas y categorías con Firebase Remote Config, optimizada para manejar listas grandes con buena experiencia de usuario.

## 1) Descripción general

La app permite:

- Agregar tareas.
- Marcar tareas como completadas.
- Eliminar tareas.
- Crear, editar y eliminar categorías.
- Asignar categoría a cada tarea.
- Filtrar tareas por categoría.
- Activar/desactivar comportamientos con feature flags de Firebase Remote Config.

## 2) Stack técnico

- Ionic + Angular
- Cordova (Android + iOS)
- Firebase Remote Config
- Ionic Storage (persistencia local)
- Angular CDK Virtual Scroll (rendimiento)

### Versiones usadas en esta entrega

- Node.js: 24.14.1
- Ionic CLI: 7.2.1
- Cordova CLI: 13.0.0
- Java JDK: 21.0.10 LTS
- Angular: 20.x
- Ionic Angular: 8.x
- Cordova Android: 15.x
- Cordova iOS: 8.x

## 3) Requisitos de entorno

- Node.js 20+
- npm
- Ionic CLI + Cordova CLI

```bash
npm i -g @ionic/cli cordova
```

### Android

- Java JDK
- Android SDK / Android Studio

### iOS

- **macOS + Xcode** (obligatorio)

## 4) Instalación y ejecución

```bash
npm install
```

### Desarrollo web

```bash
ionic serve
```

## 5) Cordova: estructura base híbrida (Android + iOS)

Este proyecto está preparado para Cordova con ambas plataformas declaradas.

```bash
npx cordova platform add android
npx cordova platform add ios
ionic cordova prepare
```

Si una plataforma ya existe, Cordova lo reportará.

## 6) Compilación y ejecución por plataforma

### Android

Ejecutar en dispositivo o emulador:

```bash
ionic cordova run android
```

Compilar release:

```bash
ionic cordova build android --release
```

### iOS (solo macOS)

Ejecutar en simulador o dispositivo:

```bash
ionic cordova run ios
```

Compilar release:

```bash
ionic cordova build ios --release
```

### iOS sin Mac (dejar el proyecto listo para evaluación)

En Windows no se puede generar IPA de forma nativa porque Apple exige macOS + Xcode, pero sí puedes dejar el proyecto preparado para que el evaluador compile iOS.

Paso a paso:

1. Instala dependencias:

```bash
npm install
```

2. Valida flujo funcional en web:

```bash
ionic serve
```

3. Valida flujo funcional en Android:

```bash
ionic cordova run android
```

4. Deja iOS configurado en el proyecto:

```bash
npx cordova platform add ios
ionic cordova prepare ios
```



## 7) Optimización de rendimiento aplicada

- `ChangeDetectionStrategy.OnPush` en vistas principales.
- `trackBy` en listas para reducir rerenders.
- `cdk-virtual-scroll-viewport` para grandes cantidades de tareas.
- Limpieza de subscripciones (`takeUntil`) en destroy.
- Persistencia local reactiva con `BehaviorSubject`.

## 8) Arquitectura del proyecto

- Separación por capas (`services`, `models`, `pages`, `components`).
- Lógica de negocio centralizada en `TaskService`.
- Feature flags encapsulados en `FirebaseRemoteConfigService`.
- Código en español coherente con la UI.
- Pruebas unitarias existentes en tabs y componentes principales.

## 9) Respuestas solicitadas de la prueba

### ¿Cuáles fueron los principales desafíos?

- Integrar mejoras visuales sin romper la estructura nativa de Ionic.
- Resolver la visibilidad del `Virtual Scroll` dentro del layout de `ion-content`.
- Mantener compatibilidad Cordova para Android e iOS desde entorno Windows.

### ¿Qué técnicas de optimización aplicaste y por qué?

- **OnPush** para reducir ciclos de detección de cambios.
- **Virtual Scroll** para renderizar solo elementos visibles y escalar mejor.
- **trackBy** para evitar recrear nodos DOM innecesariamente.
- **takeUntil** para prevenir fugas de memoria por subscripciones.

### ¿Cómo aseguraste calidad y mantenibilidad?

- Reutilizando servicios para evitar lógica duplicada.
- Manteniendo componentes enfocados por responsabilidad.
- Validando cambios de UI sin romper flujo funcional (tareas, categorías, flags).
- Conservando una estructura consistente y fácil de extender.


## 10) Entregables de la prueba

### APK (Android)

- APK firmado disponible en la sección **Releases** del repositorio.

### Demostración (video / evidencia)

- Carpeta compartida con la demostración de la app y prueba de feature flags:
- https://drive.google.com/drive/folders/18P6Uq5V5tNTOTlNf74T5BuHsnxJFAsD1?usp=sharing

### IPA (iOS)

- Puede generarse en macOS + Xcode con:

```bash
ionic cordova build ios --release
```

---

Si se evalúa desde Windows, el proyecto queda entregado con Android funcional, iOS configurado y pasos claros para compilar la IPA en macOS.

