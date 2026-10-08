# 📊 Sistema de Evaluaciones - Frontend

Integración completa del módulo de evaluaciones en el frontend de Kallpa UNL.

## 📁 Estructura de Carpetas

```
src/features/seguimiento/
├── components/
│   ├── EvaluationsList.jsx          # Lista de evaluaciones
│   ├── EvaluationForm.jsx           # Crear/editar evaluación
│   ├── EvaluationDetail.jsx         # Detalles de evaluación
│   ├── AddTestsForm.jsx             # Selector y agregador de tests
│   ├── tests/
│   │   ├── SprintTestForm.jsx       # Test de velocidad
│   │   ├── YoyoTestForm.jsx         # Test Yoyo
│   │   ├── EnduranceTestForm.jsx    # Test de resistencia
│   │   └── TechnicalAssessmentForm.jsx # Evaluación técnica
│   └── index.js
├── hooks/
│   └── useEvaluations.js            # Custom hooks con React Query
├── services/
│   └── evaluations.api.js           # Llamadas API
└── pages/
    └── EvaluationsPage.jsx          # Página principal con rutas
```

## 🔗 Rutas Disponibles

### Públicas (requieren autenticación)

| Ruta | Componente | Descripción |
|------|-----------|------------|
| `/seguimiento/evaluations` | EvaluationsList | Lista de evaluaciones |
| `/seguimiento/evaluations/create` | EvaluationForm | Crear nueva evaluación |
| `/seguimiento/evaluations/:id` | EvaluationDetail | Ver detalles |
| `/seguimiento/evaluations/:id/edit` | EvaluationForm | Editar evaluación |
| `/seguimiento/evaluations/:id/add-tests` | AddTestsForm | Agregar tests |

## 🚀 Cómo Usar

### 1. **Ver Evaluaciones**
```javascript
// Navega a la lista de evaluaciones
navigate("/seguimiento/evaluations");
```

### 2. **Crear una Evaluación**
```javascript
// Abre el formulario de crear
navigate("/seguimiento/evaluations/create");

// Datos requeridos:
{
  name: "Evaluación Física",
  date: "2024-01-15",         // YYYY-MM-DD
  time: "10:30",              // HH:mm
  user_id: 1,                 // Se obtiene automáticamente
  location: "Cancha Principal", // Opcional
  observations: "Pre-temporada" // Opcional
}
```

### 3. **Agregar Tests a una Evaluación**

Después de crear una evaluación, puedes agregar tests:

#### Test de Velocidad (Sprint)
```javascript
navigate("/seguimiento/evaluations/:id/add-tests");

// Datos del test:
{
  athlete_id: 5,
  distance_meters: 30,
  time_0_10_s: 1.85,
  time_0_30_s: 3.95,
  observations: "Buen arranque"
}
```

#### Test Yoyo
```javascript
{
  athlete_id: 5,
  shuttle_count: 47,
  final_level: "18.2",
  failures: 2,
  observations: "Buena resistencia"
}
```

#### Test de Resistencia
```javascript
{
  athlete_id: 5,
  min_duration: 12,        // minutos
  total_distance_m: 2500,  // metros
  observations: "Excelente rendimiento"
}
```

#### Evaluación Técnica
```javascript
{
  athlete_id: 5,
  ball_control: "ALTO",      // MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
  short_pass: "ALTO",
  long_pass: "MEDIO",
  shooting: "ALTO",
  dribbling: "ALTO",
  observations: "Muy buen nivel técnico"
}
```

### 4. **Editar una Evaluación**
```javascript
navigate("/seguimiento/evaluations/:id/edit");

// Datos a actualizar (todos opcionales):
{
  name: "Nombre actualizado",
  date: "2024-01-16",
  time: "14:00",
  location: "Nueva ubicación",
  observations: "Nuevas observaciones"
}
```

### 5. **Eliminar una Evaluación**
```javascript
// Se elimina desde la lista (soft delete)
// El usuario debe confirmar la acción
```

## 🎣 Hooks Disponibles

### `useEvaluations(params)`
```javascript
const { data, isLoading, error } = useEvaluations({ skip: 0, limit: 20 });
```

### `useEvaluationById(id)`
```javascript
const { data, isLoading, error } = useEvaluationById(evaluationId);
```

### `useEvaluationsByUser(userId)`
```javascript
const { data, isLoading, error } = useEvaluationsByUser(userId);
```

### `useCreateEvaluation()`
```javascript
const mutation = useCreateEvaluation();
mutation.mutate({ name, date, time, user_id, ... });
```

### `useUpdateEvaluation()`
```javascript
const mutation = useUpdateEvaluation();
mutation.mutate({ id: evaluationId, data: { name, date, ... } });
```

### `useDeleteEvaluation()`
```javascript
const mutation = useDeleteEvaluation();
mutation.mutate(evaluationId);
```

## 📝 Formularios

### EvaluationForm Props
```javascript
<EvaluationForm 
  isEdit={false}  // true para editar, false para crear
/>
```

### Formularios de Tests
Todos tienen la misma estructura:
```javascript
<SprintTestForm
  evaluationId={id}
  mutation={createSprintTest}
  onSuccess={() => {/* callback */}}
/>
```

## ✅ Validaciones

### Evaluación
- **Nombre**: Requerido, mín. 3 caracteres
- **Fecha**: Requerida, no puede ser en el pasado
- **Hora**: Requerida, formato HH:mm
- **User ID**: Se obtiene automáticamente del usuario autenticado

### Tests
- **Athlete ID**: Requerido, debe existir
- **Evaluation ID**: Requerido, debe existir
- **Valores numéricos**: Deben ser > 0
- **Escalas técnicas**: Deben ser una de las opciones válidas

## 🛠️ Integración API

El sistema utiliza los siguientes endpoints:

```javascript
// Evaluaciones
GET  /api/v1/evaluations/                    // Listar
POST /api/v1/evaluations/                    // Crear
GET  /api/v1/evaluations/{id}               // Obtener
PUT  /api/v1/evaluations/{id}               // Actualizar
DELETE /api/v1/evaluations/{id}             // Eliminar (soft)
GET  /api/v1/evaluations/user/{user_id}    // Listar por usuario

// Tests
POST /api/v1/sprint-tests/                  // Sprint
POST /api/v1/yoyo-tests/                    // Yoyo
POST /api/v1/endurance-tests/               // Resistencia
POST /api/v1/technical-assessments/         // Técnica
```

## 📦 Dependencias

El proyecto utiliza:
- **React Hook Form**: Gestión de formularios
- **React Query (@tanstack/react-query)**: Caché y sincronización de datos
- **Axios**: Cliente HTTP
- **Sonner**: Notificaciones toast
- **Lucide React**: Iconos

## 🔐 Autenticación

Todos los endpoints requieren un token Bearer válido. El token se envía automáticamente en cada petición a través del interceptor de Axios configurado en `src/app/config/http.js`.

## 📱 Responsividad

Todos los componentes son responsivos usando Tailwind CSS:
- **Móvil**: Diseño único columna
- **Tablet**: 2 columnas
- **Desktop**: Múltiples columnas

## 🎨 Estilos

Se utiliza Tailwind CSS con las siguientes convenciones:
- Colores primarios: azul (`blue-600`)
- Colores de error: rojo (`red-600`)
- Colores de éxito: verde (`green-100/800`)
- Colores de advertencia: ámbar (`amber-600`)

## 🐛 Manejo de Errores

Los errores se manejan de tres formas:

1. **Validación en formularios**: react-hook-form
2. **Errores de API**: Toast notificaciones con sonner
3. **Estado de carga**: Indicadores visuales

## 📚 Ejemplos de Uso

### Crear una evaluación completa desde JavaScript

```javascript
import evaluationsApi from "@/features/seguimiento/services/evaluations.api.js";

// 1. Crear evaluación
const evalResponse = await evaluationsApi.create({
  name: "Evaluación Física",
  date: "2024-01-15",
  time: "10:30",
  user_id: 1,
  location: "Cancha Principal",
  observations: "Pre-temporada"
});

const evaluationId = evalResponse.data.id;

// 2. Agregar test de velocidad
await evaluationsApi.createSprintTest({
  athlete_id: 5,
  evaluation_id: evaluationId,
  distance_meters: 30,
  time_0_10_s: 1.85,
  time_0_30_s: 3.95,
  date: new Date().toISOString(),
  observations: "Buen arranque"
});

// 3. Agregar test Yoyo
await evaluationsApi.createYoyoTest({
  athlete_id: 5,
  evaluation_id: evaluationId,
  shuttle_count: 47,
  final_level: "18.2",
  failures: 2,
  date: new Date().toISOString()
});
```

## 💡 Tips Útiles

1. **Para desarrollo local**: Asegúrate de que el backend esté corriendo en `http://localhost:8000`
2. **Variables de entorno**: Configura `VITE_API_URL` en `.env.local`
3. **Testing**: Usa IDs de deportistas que existan en la BD
4. **Fechas**: Siempre usa formato ISO (YYYY-MM-DD) internamente

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador para errores
2. Verifica la conexión con el backend
3. Comprueba que tengas el token de autenticación válido
4. Revisa que los IDs de atletas/usuarios existan

---

**Versión**: 1.0.0  
**Última actualización**: 29 de diciembre de 2024
