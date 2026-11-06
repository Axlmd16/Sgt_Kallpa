# Registro de evidencias estáticas

Fecha de extracción: 22 de octubre de 2026. Los fragmentos corresponden a los archivos locales revisados. Los números de línea permiten localizarlos; SHA-256 identifica el archivo completo antes de la ocultación de valores de configuración. No son capturas de ejecución ni respuestas HTTP. No se leyó ni incorporó BackendFutbol/.env.

Los valores de contraseñas de configuración que aparecen en Compose se ocultan en los fragmentos. R01–R03 y G01 se describen en el informe y no cuentan como pruebas reproducidas por esta revisión.

## E01 — Roles y estado editable del navegador

**Fuente:** `FrontendFutbol/src/app/config/roles.js` · líneas 1–75.
**SHA-256:** `ed2d9219bbef35cea857851875e86e0420376706be55d4ede1e3781a17d40b8e`

```text
0001 /**
0002  * Configuración de Roles y Permisos
0003  * Define los roles del sistema y sus permisos asociados.
0004  */
0005 
0006 /**
0007  * Enumeración de roles disponibles en el sistema
0008  */
0009 export const ROLES = {
0010   ADMIN: "Administrator",
0011   ENTRENADOR: "Coach",
0012   PASANTE: "Intern",
0013 };
0014 
0015 /**
0016  * Configuración de permisos por rol
0017  * Define qué acciones puede realizar cada rol
0018  */
0019 export const ROLE_PERMISSIONS = {
0020   [ROLES.ADMIN]: {
0021     canManageUsers: true,
0022     canManageInscriptions: true,
0023     canViewReports: true,
0024     canCreateEvaluations: true,
0025     canEditEvaluations: true,
0026     canDeleteEvaluations: true,
0027     canViewStatistics: true,
0028     canExportData: true,
0029     canManageSettings: true,
0030     canTakeAttendance: true,
0031     canEditAttendance: true,
0032     canViewAttendance: true,
0033   },
0034   [ROLES.ENTRENADOR]: {
0035     canManageUsers: false,
0036     canManageInscriptions: true,
0037     canViewReports: true,
0038     canCreateEvaluations: true,
0039     canEditEvaluations: true,
0040     canDeleteEvaluations: false,
0041     canViewStatistics: true,
0042     canExportData: true,
0043     canManageSettings: false,
0044     canTakeAttendance: true,
0045     canEditAttendance: true,
0046     canViewAttendance: true,
0047   },
0048   [ROLES.PASANTE]: {
0049     canManageUsers: false,
0050     canManageInscriptions: false,
0051     canViewReports: true,
0052     canCreateEvaluations: true,
0053     canEditEvaluations: true,
0054     canDeleteEvaluations: false,
0055     canViewStatistics: true,
0056     canExportData: true,
0057     canManageSettings: false,
0058     canTakeAttendance: true,
0059     canEditAttendance: true,
0060     canViewAttendance: true,
0061   },
0062 };
0063 
0064 /**
0065  * Rutas accesibles por rol
0066  * Define qué rutas puede acceder cada rol
0067  */
0068 export const ROLE_ROUTES = {
0069   [ROLES.ADMIN]: [
0070     "/dashboard",
0071     "/users",
0072     "/users/create",
0073     "/users/edit",
0074     "/seguimiento",
0075     "/seguimiento/evaluations",
```

**Fuente:** `FrontendFutbol/src/app/router/RoleRoute.jsx` · líneas 10–65.
**SHA-256:** `03193220aeeea84899261d23f186bca7ef41fbc460b84979457e1a776477a64b`

```text
0010 import { USER_DATA_KEY, ROUTES } from "../config/constants";
0011 
0012 const RoleRoute = ({ allowedRoles = [] }) => {
0013   const location = useLocation();
0014 
0015   const userData = localStorage.getItem(USER_DATA_KEY);
0016 
0017   // Si no hay datos de usuario, se redirecciona al login
0018   if (!userData) {
0019     return (
0020       <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
0021     );
0022   }
0023 
0024   // Parsear datos del usuario
0025   let user;
0026   try {
0027     user = JSON.parse(userData);
0028   } catch (error) {
0029     // Limpiar datos corruptos y redirigir al login
0030     console.error("[RoleRoute] Error parsing user data:", error);
0031     localStorage.removeItem(USER_DATA_KEY);
0032     return (
0033       <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
0034     );
0035   }
0036 
0037   // Obtener el rol del usuario
0038   const userRole = user?.role || user?.rol;
0039 
0040   // Verificar si el rol del usuario está en los roles permitidos
0041   const hasAccess = allowedRoles.includes(userRole);
0042 
0043   // Si no tiene acceso, mostrar página de acceso denegado o redirigir
0044   if (!hasAccess) {
0045     // Redirigir al dashboard con mensaje
0046     return (
0047       <Navigate
0048         to={ROUTES.DASHBOARD}
0049         state={{
0050           accessDenied: true,
0051           message: "No tienes permisos para acceder a esta sección",
0052         }}
0053         replace
0054       />
0055     );
0056 
0057     //Todo:  Mostrar componente de acceso denegado (Preguntar a ver que tal)
0058     // return <AccessDeniedPage />;
0059   }
0060 
0061   return <Outlet />;
0062 };
0063 
0064 RoleRoute.propTypes = {
0065   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
```

**Fuente:** `FrontendFutbol/src/app/providers/AuthProvider.jsx` · líneas 79–104.
**SHA-256:** `adbbf4df6db483e0b533eb0f9229c89e47e77ced0da3275ce381a0202824cb8f`

```text
0079   const saveAuthData = useCallback((token, userData, refreshToken = null) => {
0080     // Guardar en localStorage
0081     localStorage.setItem(AUTH_TOKEN_KEY, token);
0082     localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
0083     if (refreshToken) {
0084       localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
0085     }
0086 
0087     // Actualizar estado
0088     setUser(userData);
0089     setIsAuthenticated(true);
0090   }, []);
0091 
0092   /**
0093    * Limpia los datos de autenticación
0094    */
0095   const clearAuthData = useCallback(() => {
0096     // Limpiar localStorage
0097     localStorage.removeItem(AUTH_TOKEN_KEY);
0098     localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
0099     localStorage.removeItem(USER_DATA_KEY);
0100 
0101     // Limpiar estado
0102     setUser(null);
0103     setIsAuthenticated(false);
0104   }, []);
```

## E02 — Autorización de usuarios y evaluaciones

**Fuente:** `BackendFutbol/app/services/routers/user_router.py` · líneas 46–57.
**SHA-256:** `be0a10464b7bdb35074d9b0d7ce8225c12d14f4eec361509d81a6e3f8a0d8a35`

```text
0046 @router.post(
0047     "/create",
0048     response_model=ResponseSchema,
0049     status_code=status.HTTP_201_CREATED,
0050     summary="Crear usuario administrador/entrenador",
0051     description="Crea un usuario administrador o entrenador. Solo admin.",
0052 )
0053 async def admin_create_user(
0054     payload: AdminCreateUserRequest,
0055     db: Annotated[Session, Depends(get_db)],
0056     current_admin: Annotated[Account, Depends(get_current_admin)],
0057 ) -> ResponseSchema:
```

**Fuente:** `BackendFutbol/app/services/routers/user_router.py` · líneas 119–151.
**SHA-256:** `be0a10464b7bdb35074d9b0d7ce8225c12d14f4eec361509d81a6e3f8a0d8a35`

```text
0119 @router.get(
0120     "/all",
0121     response_model=ResponseSchema[PaginatedResponse[UserResponse]],
0122     status_code=status.HTTP_200_OK,
0123     summary="Obtener todos los usuarios con paginación",
0124     description=(
0125         "Obtiene una lista paginada de todos los usuarios, "
0126         "con opción de búsqueda y filtrado por rol. Requiere autenticación."
0127     ),
0128 )
0129 def get_all_users(
0130     db: Annotated[Session, Depends(get_db)],
0131     filters: Annotated[UserFilter, Depends()],
0132     current_user: Annotated[Account, Depends(get_current_account)],
0133 ):
0134     try:
0135         items, total = user_controller.get_all_users(db=db, filters=filters)
0136 
0137         return ResponseSchema(
0138             status="success",
0139             message="Usuarios obtenidos correctamente",
0140             data=PaginatedResponse(
0141                 items=items,
0142                 total=total,
0143                 page=filters.page,
0144                 limit=filters.limit,
0145             ).model_dump(),
0146         )
0147     except AppException as exc:
0148         return handle_app_exception(exc)
0149     except Exception as e:
0150         return handle_unexpected_exception(e)
0151 
```

**Fuente:** `BackendFutbol/app/services/routers/evaluation_router.py` · líneas 199–225.
**SHA-256:** `2e03dac5b65fd6c12b133169fd6f42c9c35e9e69ae160843fb9c047594fc4a0b`

```text
0199 @router.delete(
0200     "/{evaluation_id}",
0201     response_model=ResponseSchema,
0202     status_code=status.HTTP_200_OK,
0203     summary="Eliminar evaluación",
0204     description="Elimina (soft delete) una evaluación.",
0205 )
0206 async def delete_evaluation(
0207     evaluation_id: int,
0208     db: Annotated[Session, Depends(get_db)],
0209     current_account: Annotated[Account, Depends(get_current_account)],
0210 ) -> ResponseSchema:
0211     """Eliminar una evaluación."""
0212     try:
0213         deleted = evaluation_controller.delete_evaluation(db, evaluation_id)
0214 
0215         if not deleted:
0216             raise HTTPException(status_code=404, detail="Evaluación no encontrada")
0217 
0218         return ResponseSchema(
0219             status="success",
0220             message="Evaluación eliminada correctamente",
0221         )
0222     except HTTPException:
0223         raise
0224     except Exception as exc:
0225         raise HTTPException(status_code=500, detail=str(exc)) from exc
```

**Fuente:** `BackendFutbol/app/controllers/evaluation_controller.py` · líneas 157–167.
**SHA-256:** `ac556efb2b4af0996c9f629eb87b159c0b10d4c0dce00597b5051ce38e46a10d`

```text
0157     def delete_evaluation(self, db: Session, evaluation_id: int) -> bool:
0158         """Eliminar una evaluación.
0159 
0160         Args:
0161             db: Sesión de base de datos
0162             evaluation_id: ID de la evaluación
0163 
0164         Returns:
0165             True si fue eliminada, False si no existe
0166         """
0167         return self.evaluation_dao.delete(db, evaluation_id)
```

## E03 — Consulta pública de representantes

**Fuente:** `BackendFutbol/app/services/routers/representative_router.py` · líneas 37–85.
**SHA-256:** `709a04d44cba26466b87db5954f1546c4785d6e3be9507586cef35937bbb9d1d`

```text
0037 @router.get(
0038     "/by-dni/{dni}",
0039     response_model=ResponseSchema[RepresentativeResponse],
0040     status_code=status.HTTP_200_OK,
0041     summary="Buscar representante por DNI",
0042     description="Busca un representante por su DNI. Endpoint público para verificar "
0043     "si el representante ya existe antes de inscribir un menor.",
0044 )
0045 async def get_representative_by_dni(
0046     dni: str,
0047     db: Annotated[Session, Depends(get_db)],
0048 ):
0049     """Busca un representante por DNI. Útil para el frontend."""
0050     try:
0051         result = await representative_controller.get_representative_by_dni(
0052             db=db, dni=dni
0053         )
0054 
0055         if result is None:
0056             return JSONResponse(
0057                 status_code=status.HTTP_404_NOT_FOUND,
0058                 content=ResponseSchema(
0059                     status="error",
0060                     message="Representante no encontrado",
0061                     data=None,
0062                     errors=None,
0063                 ).model_dump(),
0064             )
0065 
0066         return ResponseSchema(
0067             status="success",
0068             message="Representante encontrado",
0069             data=result.model_dump(),
0070         )
0071     except AppException as exc:
0072         return handle_app_exception(exc)
0073     except Exception as e:
0074         return handle_unexpected_exception(e)
0075 
0076 
0077 # ==========================================
0078 # ENDPOINTS CON AUTENTICACIÓN
0079 
0080 
0081 @router.post(
0082     "/create",
0083     response_model=ResponseSchema[RepresentativeInscriptionResponseDTO],
0084     status_code=status.HTTP_201_CREATED,
0085     summary="Crear representante",
```

**Fuente:** `BackendFutbol/app/controllers/representative_controller.py` · líneas 216–269.
**SHA-256:** `f217728b0196aa3687a3cf3c57fc6b37af3db3d4e6c256fd103eb03b44a1aa7c`

```text
0216     async def get_representative_by_dni(
0217         self, db: Session, dni: str
0218     ) -> Optional[RepresentativeResponse]:
0219         """
0220         Busca un representante por DNI.
0221         Retorna None si no existe (útil para verificar existencia desde frontend).
0222         Incluye datos adicionales (nombres, dirección) obtenidos del MS de personas.
0223         """
0224         representative = self.representative_dao.get_by_field(
0225             db, "dni", dni, only_active=True
0226         )
0227         if not representative:
0228             return None
0229 
0230         first_name: Optional[str] = None
0231         last_name: Optional[str] = None
0232         direction: Optional[str] = None
0233 
0234         # Intentar obtener información del MS (async)
0235         try:
0236             person_data = await self.person_ms_service.get_user_by_identification(
0237                 representative.dni
0238             )
0239             if person_data and person_data.get("data"):
0240                 ms_data = person_data["data"]
0241                 first_name = ms_data.get("first_name")
0242                 last_name = ms_data.get("last_name")
0243                 direction = ms_data.get("direction")
0244         except Exception as ms_error:
0245             logger.warning(
0246                 "No se pudo obtener datos del MS para representante %s: %s",
0247                 representative.id,
0248                 ms_error,
0249             )
0250 
0251         return RepresentativeResponse(
0252             id=representative.id,
0253             full_name=representative.full_name,
0254             dni=representative.dni,
0255             phone=representative.phone,
0256             email=representative.email,
0257             relationship_type=getattr(
0258                 representative.relationship_type,
0259                 "value",
0260                 str(representative.relationship_type),
0261             ),
0262             first_name=first_name,
0263             last_name=last_name,
0264             direction=direction,
0265             is_active=representative.is_active,
0266             created_at=(
0267                 representative.created_at.isoformat()
0268                 if representative.created_at
0269                 else None
```

## E04 — Hash y propósito de tokens

**Fuente:** `BackendFutbol/app/utils/security.py` · líneas 20–25.
**SHA-256:** `1a0aca8ba30a8590e177be12f90e1120832f5b8fd271568335cfa0f5394750e1`

```text
0020 _pwd_context = CryptContext(
0021     schemes=["bcrypt"],
0022     deprecated="auto",
0023     bcrypt__rounds=10,
0024 )
0025 oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/accounts/login")
```

**Fuente:** `BackendFutbol/app/utils/security.py` · líneas 148–178.
**SHA-256:** `1a0aca8ba30a8590e177be12f90e1120832f5b8fd271568335cfa0f5394750e1`

```text
0148     exp_seconds = expires_seconds or settings.TOKEN_EXPIRES
0149     now = datetime.now(timezone.utc)
0150     payload = {
0151         "sub": str(subject),
0152         "iat": int(now.timestamp()),
0153         "exp": int((now + timedelta(seconds=exp_seconds)).timestamp()),
0154     }
0155     if extra_claims:
0156         payload.update(extra_claims)
0157 
0158     return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
0159 
0160 
0161 def create_reset_token(account_id: int, email: str, expires_seconds: int = 900) -> str:
0162     """Genera un token para restablecimiento de contraseña.
0163 
0164     Args:
0165         account_id: ID de la cuenta para la cual se genera el token.
0166         email: Correo electrónico de la cuenta.
0167         expires_seconds: Tiempo de expiración en segundos
0168         (por defecto 900 = 15 minutos).
0169 
0170     Returns:
0171         str: Token JWT con action='reset_password' para restablecimiento.
0172     """
0173 
0174     return create_access_token(
0175         subject=account_id,
0176         expires_seconds=expires_seconds,
0177         extra_claims={"action": "reset_password", "email": email},
0178     )
```

**Fuente:** `BackendFutbol/app/utils/security.py` · líneas 194–221.
**SHA-256:** `1a0aca8ba30a8590e177be12f90e1120832f5b8fd271568335cfa0f5394750e1`

```text
0194     try:
0195         return jwt.decode(
0196             token,
0197             settings.JWT_SECRET,
0198             algorithms=[settings.JWT_ALGORITHM],
0199         )
0200     except JWTError as exc:
0201         raise UnauthorizedException("Token inválido o expirado") from exc
0202 
0203 
0204 def validate_reset_token(token: str) -> dict:
0205     """Valida que el token sea de tipo reset_password y retorna el payload.
0206 
0207     Args:
0208         token: Token JWT a validar.
0209 
0210     Returns:
0211         dict: Payload del token si es válido y tiene action='reset_password'.
0212 
0213     Raises:
0214         UnauthorizedException: Si el token es inválido,
0215         expirado, o no tiene action='reset_password'.
0216     """
0217 
0218     payload = decode_token(token)
0219     if payload.get("action") != "reset_password":
0220         raise UnauthorizedException("Token de reset inválido")
0221     return payload
```

**Fuente:** `BackendFutbol/app/utils/security.py` · líneas 240–270.
**SHA-256:** `1a0aca8ba30a8590e177be12f90e1120832f5b8fd271568335cfa0f5394750e1`

```text
0240     exp_seconds = expires_seconds or settings.REFRESH_TOKEN_EXPIRES
0241     now = datetime.now(timezone.utc)
0242     payload = {
0243         "sub": str(subject),
0244         "iat": int(now.timestamp()),
0245         "exp": int((now + timedelta(seconds=exp_seconds)).timestamp()),
0246         "type": "refresh",
0247     }
0248     if extra_claims:
0249         payload.update(extra_claims)
0250 
0251     return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
0252 
0253 
0254 def validate_refresh_token(token: str) -> dict:
0255     """Valida que el token sea de tipo refresh y retorna el payload.
0256 
0257     Args:
0258         token: Token JWT a validar.
0259 
0260     Returns:
0261         dict: Payload del token si es válido y tiene type='refresh'.
0262 
0263     Raises:
0264         UnauthorizedException: Si el token es inválido,
0265         expirado, o no tiene type='refresh'.
0266     """
0267     payload = decode_token(token)
0268     if payload.get("type") != "refresh":
0269         raise UnauthorizedException("Token de refresco inválido")
0270     return payload
```

**Fuente:** `BackendFutbol/app/utils/security.py` · líneas 273–306.
**SHA-256:** `1a0aca8ba30a8590e177be12f90e1120832f5b8fd271568335cfa0f5394750e1`

```text
0273 def get_current_account(
0274     token: str = _TOKEN_DEP,
0275     db: Session = _DB_DEP,
0276 ) -> Account:
0277     """Dependencia para obtener la cuenta autenticada desde el JWT.
0278 
0279     Args:
0280         token: JWT extraído del encabezado ``Authorization`` mediante
0281             el esquema ``OAuth2PasswordBearer``.
0282         db: Sesión de base de datos de SQLAlchemy usada para consultar
0283             la cuenta asociada al token.
0284 
0285     Returns:
0286         Account: Objeto de cuenta autenticada correspondiente al sujeto
0287         (``sub``) contenido en el token.
0288 
0289     Raises:
0290         UnauthorizedException: Si el token es inválido, no contiene ``sub``,
0291             o si la cuenta asociada no existe o se encuentra inactiva.
0292     """
0293     try:
0294         payload = decode_token(token)
0295     except UnauthorizedException as exc:
0296         raise exc
0297 
0298     sub = payload.get("sub")
0299     if sub is None:
0300         raise UnauthorizedException("Token inválido: falta identificador")
0301 
0302     account = AccountDAO().get_by_id(db, int(sub), only_active=True)
0303     if not account:
0304         raise UnauthorizedException("Cuenta no encontrada o inactiva")
0305 
0306     return account
```

## E05 — Login recuperación y sesiones

**Fuente:** `BackendFutbol/app/controllers/account_controller.py` · líneas 36–58.
**SHA-256:** `8b2f727b4b3e6d34cf8ba770c9779fcdbf468354e1ab581e272a6ce2ff953448`

```text
0036     def login(self, db: Session, payload: LoginRequest) -> LoginResponse:
0037         """Iniciar sesión y obtener un token de acceso."""
0038         email = payload.email.strip().lower()
0039         account = self.account_dao.get_by_email(db, email, only_active=True)
0040 
0041         if not account:
0042             # Verificamos contra un hash ficticio para igualar tiempos de respuesta
0043             verify_password(payload.password, DUMMY_PASSWORD_HASH)
0044             raise UnauthorizedException("Credenciales inválidas")
0045 
0046         if not verify_password(payload.password, account.password_hash):
0047             raise UnauthorizedException("Credenciales inválidas")
0048 
0049         access_token = self.generate_jwt(account)
0050         refresh_token = create_refresh_token(subject=account.id)
0051 
0052         return LoginResponse(
0053             access_token=access_token,
0054             refresh_token=refresh_token,
0055             token_type="bearer",  # nosec
0056             expires_in=settings.TOKEN_EXPIRES,
0057             refresh_expires_in=settings.REFRESH_TOKEN_EXPIRES,
0058         )
```

**Fuente:** `BackendFutbol/app/controllers/account_controller.py` · líneas 95–104.
**SHA-256:** `8b2f727b4b3e6d34cf8ba770c9779fcdbf468354e1ab581e272a6ce2ff953448`

```text
0095         email = payload.email.strip().lower()
0096         account = self.account_dao.get_by_email(db, email, only_active=True)
0097 
0098         if not account:
0099             return
0100 
0101         reset_token = create_reset_token(account.id, account.email)
0102         send_reset_email(
0103             to_email=account.email, full_name=email, reset_token=reset_token
0104         )
```

**Fuente:** `BackendFutbol/app/controllers/account_controller.py` · líneas 119–179.
**SHA-256:** `8b2f727b4b3e6d34cf8ba770c9779fcdbf468354e1ab581e272a6ce2ff953448`

```text
0119         account = self.account_dao.get_by_id(db, user_id, only_active=True)
0120         if not account:
0121             raise UnauthorizedException("Cuenta no encontrada")
0122 
0123         if not verify_password(payload.current_password, account.password_hash):
0124             raise UnauthorizedException("Contraseña actual incorrecta")
0125 
0126         account.password_hash = hash_password(payload.new_password)
0127         db.commit()
0128 
0129     def confirm_password_reset(
0130         self, db: Session, payload: PasswordResetConfirm
0131     ) -> None:  # noqa: E501
0132         """Valida el token de reset y actualiza la contraseña.
0133 
0134         Args:
0135             db: Sesión de base de datos.
0136             payload: Token de reset y la nueva contraseña.
0137 
0138         Raises:
0139             UnauthorizedException: Si el token es inválido o la cuenta no está activa.
0140         """
0141 
0142         data = validate_reset_token(payload.token)
0143         account_id = int(data["sub"])
0144 
0145         account = self.account_dao.get_by_id(db, account_id, only_active=True)
0146         if not account:
0147             raise UnauthorizedException("Cuenta no encontrada o inactiva")
0148 
0149         account.password_hash = hash_password(payload.new_password)
0150         db.commit()
0151 
0152     def refresh_token(self, db: Session, payload: RefreshTokenRequest) -> LoginResponse:
0153         """Genera un nuevo access token usando un refresh token válido.
0154 
0155         Args:
0156             db: Sesión de base de datos.
0157             payload: Contiene el refresh_token a validar.
0158 
0159         Returns:
0160             LoginResponse: Nuevo access token y el mismo refresh token.
0161 
0162         Raises:
0163             UnauthorizedException: Si el refresh token es inválido o expirado.
0164         """
0165         data = validate_refresh_token(payload.refresh_token)
0166         account_id = int(data["sub"])
0167 
0168         account = self.account_dao.get_by_id(db, account_id, only_active=True)
0169         if not account:
0170             raise UnauthorizedException("Cuenta no encontrada o inactiva")
0171 
0172         new_access_token = self.generate_jwt(account)
0173 
0174         return LoginResponse(
0175             access_token=new_access_token,
0176             refresh_token=payload.refresh_token,  # Reutilizar el refresh token
0177             token_type="bearer",  # nosec
0178             expires_in=settings.TOKEN_EXPIRES,
0179             refresh_expires_in=settings.REFRESH_TOKEN_EXPIRES,
```

**Fuente:** `FrontendFutbol/src/features/auth/services/auth.api.js` · líneas 26–34.
**SHA-256:** `3d0f8ed6958d71e73a603fc637f5ef987128f4cbb770cee42c1a8f77a192a590`

```text
0026   /**
0027    * Cierra la sesión del usuario actual
0028    * Invalida el token en el servidor
0029    * @returns {Promise<Object>} Respuesta de confirmación
0030    */
0031   logout: async () => {
0032     // El backend actual no expone logout; limpiamos solo en cliente.
0033     return { status: "success" };
0034   },
```

## E06 — Política de contraseña en servidor

**Fuente:** `BackendFutbol/app/schemas/account_schema.py` · líneas 67–113.
**SHA-256:** `bd51acba4e523130a7b8626b18ebd14893263c8e90d7d92967c58dc07a00450e`

```text
0067     token: str
0068     new_password: str = Field(..., min_length=8, max_length=64)
0069 
0070     @field_validator("new_password")
0071     @classmethod
0072     def validate_password_strength(cls, v: str) -> str:
0073         """Valida la complejidad de la contraseña."""
0074         if not re.search(r"[A-Z]", v):
0075             raise ValueError("La contraseña debe contener al menos una letra mayúscula")
0076         if not re.search(r"[a-z]", v):
0077             raise ValueError("La contraseña debe contener al menos una letra minúscula")
0078         if not re.search(r"[0-9]", v):
0079             raise ValueError("La contraseña debe contener al menos un número")
0080         if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
0081             raise ValueError(
0082                 "La contraseña debe contener al menos un carácter especial "
0083                 '(!@#$%^&*(),.?":{}|<>)'
0084             )
0085         return v
0086 
0087 
0088 class ChangePasswordRequest(BaseModel):
0089     """Datos para cambio de contraseña de usuario autenticado.
0090 
0091     Attributes:
0092         current_password: Para validar la autoría.
0093         new_password: Nueva contraseña.
0094         confirm_password: Para verificar que no hubo error de tipeo.
0095     """
0096 
0097     current_password: str
0098     new_password: str = Field(..., min_length=8, max_length=64)
0099     confirm_password: str = Field(..., min_length=8, max_length=64)
0100 
0101     @field_validator("new_password")
0102     @classmethod
0103     def validate_password_strength(cls, v: str) -> str:
0104         """Valida la complejidad de la contraseña (misma lógica que reset)."""
0105         return PasswordResetConfirm.validate_password_strength(v)
0106 
0107     @field_validator("confirm_password")
0108     @classmethod
0109     def passwords_match(cls, v: str, info: Field) -> str:
0110         """Verifica que las contraseñas coincidan."""
0111         if "new_password" in info.data and v != info.data["new_password"]:
0112             raise ValueError("Las contraseñas no coinciden")
0113         return v
```

**Fuente:** `BackendFutbol/app/services/routers/account_router.py` · líneas 28–49.
**SHA-256:** `eb611a9f4dfaa01159cda57254986eccfaef64e9677873ec9fe0066ee6f3f358`

```text
0028 @router.post(
0029     "/login",
0030     response_model=ResponseSchema,
0031     status_code=status.HTTP_200_OK,
0032     summary="Iniciar sesión",
0033     description="Valida credenciales y devuelve un token JWT.",
0034 )
0035 def login(
0036     payload: LoginRequest, db: Annotated[Session, Depends(get_db)]
0037 ) -> ResponseSchema:
0038     """Endpoint para iniciar sesión y obtener un token JWT."""
0039     try:
0040         result = account_controller.login(db, payload)
0041         return ResponseSchema(
0042             status="success",
0043             message="Inicio de sesión exitoso",
0044             data=result.model_dump(),
0045         )
0046     except AppException as exc:
0047         return handle_app_exception(exc)
0048     except Exception as e:
0049         return handle_unexpected_exception(e)
```

**Fuente:** `BackendFutbol/main.py` · líneas 89–99.
**SHA-256:** `fd05a7d59a4637010c09ecf532eddb3fe730eb75aca2be39854177d744bc1a6e`

```text
0089 def _configure_middlewares(app: FastAPI) -> None:
0090     """Configura los middlewares de la aplicación."""
0091     app.add_middleware(
0092         CORSMiddleware,
0093         allow_origins=settings.ALLOWED_ORIGINS or ["*"],
0094         allow_credentials=True,
0095         allow_methods=["*"],
0096         allow_headers=["*"],
0097     )
0098 
0099 
```

## E07 — Configuración local y cabeceras

**Fuente:** `FrontendFutbol/nginx.conf` · líneas 1–28.
**SHA-256:** `8eaabe591bc5d64d9fd8b56b3c3b4d225b7a7ca066ba052d24ad9340578cc2a0`

```text
0001 server {
0002     listen 80;
0003     server_name localhost;
0004     root /usr/share/nginx/html;
0005     index index.html;
0006 
0007     # Manejo de rutas SPA - redirige todo a index.html
0008     location / {
0009         try_files $uri $uri/ /index.html;
0010     }
0011 
0012     # Cache de assets estáticos
0013     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
0014         expires 1y;
0015         add_header Cache-Control "public, immutable";
0016     }
0017 
0018     # No cachear index.html
0019     location = /index.html {
0020         expires -1;
0021         add_header Cache-Control "no-store, no-cache, must-revalidate";
0022     }
0023 
0024     # Seguridad
0025     add_header X-Frame-Options "DENY" always;
0026     add_header X-Content-Type-Options "nosniff" always;
0027     add_header X-XSS-Protection "1; mode=block" always;
0028 }
```

**Fuente:** `docker-compose.yml` · líneas 1–119.
**SHA-256:** `64a66a71e7be7adb4b218344106b6ce3e34d6ae50c31dce12ea49d0e1816e75f`

```text
0001 name: backendfutbol
0002 
0003 services:
0004     postgres:
0005         image: postgres:16-alpine
0006         container_name: kallpa-postgres
0007         restart: unless-stopped
0008         environment:
0009             POSTGRES_DB: ${POSTGRES_DB:-futbol_db}
0010             POSTGRES_USER: ${POSTGRES_USER:-dev_user}
0011             POSTGRES_PASSWORD: [valor omitido]
0012         ports:
0013             - "5432:5432"
0014         volumes:
0015             - postgres_data:/var/lib/postgresql/data
0016         healthcheck:
0017             test: ["CMD-SHELL", 'pg_isready -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"']
0018             interval: 5s
0019             timeout: 5s
0020             retries: 10
0021 
0022     mariadb:
0023         image: mariadb:11
0024         container_name: mariadb-db
0025         restart: unless-stopped
0026         environment:
0027             MARIADB_ROOT_PASSWORD: [valor omitido]
0028             MARIADB_DATABASE: ${MARIADB_DATABASE:-sportDB}
0029             MARIADB_USER: ${MARIADB_USER:-desarrollo}
0030             MARIADB_PASSWORD: [valor omitido]
0031         ports:
0032             - "3306:3306"
0033         volumes:
0034             - mariadb_data:/var/lib/mysql
0035         healthcheck:
0036             test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
0037             interval: 10s
0038             timeout: 5s
0039             retries: 5
0040 
0041     app:
0042         image: joseguaman1/users-docker:v1
0043         container_name: springboot-app
0044         restart: unless-stopped
0045         depends_on:
0046             mariadb:
0047                 condition: service_healthy
0048         ports:
0049             - "8096:8096"
0050         environment:
0051             SPRING_APPLICATION_NAME: user
0052             SPRING_DATASOURCE_URL: jdbc:mariadb://mariadb:3306/${MARIADB_DATABASE:-sportDB}
0053             SPRING_DATASOURCE_USERNAME: ${MARIADB_USER:-desarrollo}
0054             SPRING_DATASOURCE_PASSWORD: [valor omitido]
0055             SPRING_DATASOURCE_DRIVER_CLASS_NAME: org.mariadb.jdbc.Driver
0056             SPRING_JPA_HIBERNATE_DDL_AUTO: update
0057             SPRING_JPA_SHOW_SQL: "true"
0058             SPRING_DOCKER_COMPOSE_ENABLED: "false"
0059             CORS_ALLOWED_ORIGINS: http://localhost:3000,http://localhost:4200,http://localhost,http://localhost:5173
0060             CORS_ALLOWED_METHODS: GET,POST,PUT,DELETE,OPTIONS
0061             CORS_ALLOWED_HEADERS: "*"
0062             CORS_ALLOW_CREDENTIALS: "true"
0063             OTHERS_KEY: [valor omitido]
0064             SERVER_PORT: 8096
0065 
0066     person-ms-init:
0067         image: backendfutbol-backend
0068         container_name: kallpa-person-ms-init
0069         restart: "no"
0070         env_file:
0071             - ./BackendFutbol/.env
0072         environment:
0073             PERSON_MS_BASE_URL: http://app:8096
0074         depends_on:
0075             app:
0076                 condition: service_started
0077         command: ["python", "scripts/init_person_ms.py"]
0078 
0079     backend:
0080         image: backendfutbol-backend
0081         build:
0082             context: ./BackendFutbol
0083             dockerfile: Dockerfile
0084         container_name: kallpa-backend
0085         restart: unless-stopped
0086         env_file:
0087             - ./BackendFutbol/.env
0088         depends_on:
0089             postgres:
0090                 condition: service_healthy
0091             app:
0092                 condition: service_started
0093             person-ms-init:
0094                 condition: service_completed_successfully
0095         environment:
0096             # Use Docker service DNS names instead of localhost inside the container.
0097             DB_HOST: postgres
0098             PERSON_MS_BASE_URL: http://app:8096
0099         ports:
0100             - "8001:8000"
0101 
0102     frontend:
0103         build:
0104             context: ./FrontendFutbol
0105             dockerfile: Dockerfile
0106             args:
0107                 VITE_API_URL: ${VITE_API_URL:-http://localhost:8001/api/v1}
0108         container_name: kallpa-frontend
0109         restart: unless-stopped
0110         depends_on:
0111             - backend
0112         ports:
0113             - "5173:80"
0114 
0115 volumes:
0116     postgres_data:
0117     # Persistent storage for the external person service.
0118     mariadb_data:
0119         name: backendfutbol_mariadb_data
```

**Fuente:** `BackendFutbol/app/core/config.py` · líneas 15–30.
**SHA-256:** `87517c22c5050b5169e7730b4866cea7c647bb44d248e46866227c8e7233836c`

```text
0015     # ================= APP =================
0016     APP_NAME: str = "Backend Futbol API"
0017     APP_VERSION: str = "1.0.0"
0018     APP_PORT: int = 8000
0019     APP_HOST: str = "0.0.0.0"  # nosec
0020     DEBUG: bool = False
0021 
0022     # ================= SECURITY =================
0023     JWT_SECRET: str
0024     JWT_ALGORITHM: str = "HS256"
0025     TOKEN_EXPIRES: int = 3600  # Access token: 1 hora
0026     REFRESH_TOKEN_EXPIRES: int = 604800  # Refresh token: 7 días
0027 
0028     # ================= CORS =================
0029     ALLOWED_ORIGINS: List[str] = ["*"]
0030 
```

**Fuente:** `BackendFutbol/main.py` · líneas 89–99.
**SHA-256:** `fd05a7d59a4637010c09ecf532eddb3fe730eb75aca2be39854177d744bc1a6e`

```text
0089 def _configure_middlewares(app: FastAPI) -> None:
0090     """Configura los middlewares de la aplicación."""
0091     app.add_middleware(
0092         CORSMiddleware,
0093         allow_origins=settings.ALLOWED_ORIGINS or ["*"],
0094         allow_credentials=True,
0095         allow_methods=["*"],
0096         allow_headers=["*"],
0097     )
0098 
0099 
```

## E08 — Dependencias e imágenes

**Fuente:** `BackendFutbol/Dockerfile` · líneas 1–46.
**SHA-256:** `d2929305b4f32cfd9c394916769a134256342b9d2e662bdbc37b2d194b5ee170`

```text
0001 # Imagen base de Python
0002 FROM python:3.11-slim
0003 
0004 # Variables de entorno
0005 ENV PYTHONDONTWRITEBYTECODE=1
0006 ENV PYTHONUNBUFFERED=1
0007 
0008 # Directorio de trabajo
0009 WORKDIR /app
0010 
0011 # Instalar dependencias del sistema para WeasyPrint y otras librerías
0012 RUN apt-get update && apt-get install -y --no-install-recommends \
0013     build-essential \
0014     python3-dev \
0015     python3-cffi \
0016     libpango-1.0-0 \
0017     libpangocairo-1.0-0 \
0018     libpangoft2-1.0-0 \
0019     libgdk-pixbuf-2.0-0 \
0020     libffi-dev \
0021     libcairo2 \
0022     libcairo2-dev \
0023     libgirepository1.0-dev \
0024     gir1.2-pango-1.0 \
0025     fonts-liberation \
0026     fonts-dejavu-core \
0027     shared-mime-info \
0028     && rm -rf /var/lib/apt/lists/*
0029 
0030 # Instalar uv para manejo de paquetes
0031 COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
0032 
0033 # Copiar archivos de dependencias
0034 COPY pyproject.toml uv.lock ./
0035 
0036 # Instalar dependencias de Python
0037 RUN uv sync --frozen --no-dev
0038 
0039 # Copiar el código de la aplicación
0040 COPY . .
0041 
0042 # Exponer el puerto
0043 EXPOSE 8000
0044 
0045 # Comando para ejecutar la aplicación
0046 CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Fuente:** `FrontendFutbol/Dockerfile` · líneas 1–33.
**SHA-256:** `70e18a2c969911cd601a7425bd61b5b55978d0cd1698579c67d2ed8c1f4020d0`

```text
0001 # Build stage
0002 FROM node:20-alpine AS build
0003 
0004 WORKDIR /app
0005 
0006 # Copiar archivos de dependencias
0007 COPY package.json package-lock.json ./
0008 
0009 # Instalar dependencias
0010 RUN npm ci
0011 
0012 # Copiar código fuente
0013 COPY . .
0014 
0015 # Argumento para la URL del API (se pasa en build time)
0016 ARG VITE_API_URL=http://localhost:8000/api/v1
0017 ENV VITE_API_URL=$VITE_API_URL
0018 
0019 # Build de producción
0020 RUN npm run build
0021 
0022 # Production stage - Nginx
0023 FROM nginx:alpine
0024 
0025 # Copiar configuración de nginx para SPA
0026 COPY nginx.conf /etc/nginx/conf.d/default.conf
0027 
0028 # Copiar archivos compilados
0029 COPY --from=build /app/dist /usr/share/nginx/html
0030 
0031 EXPOSE 80
0032 
0033 CMD ["nginx", "-g", "daemon off;"]
```

## E09 — Consultas con ORM

**Fuente:** `BackendFutbol/app/dao/account_dao.py` · líneas 15–35.
**SHA-256:** `eec2ec632f578c6961f13dca83567274d3e8ccf618b523be9bb3aeeb21c3e808`

```text
0015     def get_by_email(
0016         self, db: Session, email: str, only_active: bool = True
0017     ) -> Optional[Account]:  # noqa: E501
0018         """Obtener una cuenta por email con usuario precargado.
0019 
0020         Args:
0021             db: Sesión de SQLAlchemy para realizar la consulta.
0022             email: Correo electrónico de la cuenta a buscar.
0023             only_active: Si es True, limita la búsqueda a cuentas activas.
0024 
0025         Returns:
0026             Account | None: Cuenta encontrada o None si no existe/coincide el filtro.
0027         """
0028         query = (
0029             db.query(Account)
0030             .options(joinedload(Account.user))
0031             .filter(Account.email == email)
0032         )
0033         if only_active:
0034             query = query.filter(Account.is_active == True)  # noqa: E712
0035         return query.first()
```

**Fuente:** `BackendFutbol/app/dao/user_dao.py` · líneas 49–92.
**SHA-256:** `ddf898ea5442582c2535f71b9faaf237d4ed4f9e28855a33f7b724c2586e6fca`

```text
0049     def _apply_search_filter(self, query, search: str):
0050         """Aplica filtro de búsqueda por nombre, DNI o email."""
0051         if search:
0052             search_norm = search.strip()
0053             query = query.filter(
0054                 or_(
0055                     self.model.full_name.ilike(f"%{search_norm}%"),
0056                     self.model.dni.ilike(f"%{search_norm}%"),
0057                     self.model.account.has(Account.email.ilike(f"%{search_norm}%")),
0058                 )
0059             )
0060         return query
0061 
0062     def _paginate_query(self, query, filters) -> Tuple[List[User], int]:
0063         """Aplica paginación y retorna items con total."""
0064         total = query.count()
0065         items = (
0066             query.order_by(self.model.id.desc())
0067             .offset(filters.skip)
0068             .limit(filters.limit)
0069             .all()
0070         )
0071         return items, total
0072 
0073     def get_all_with_filters(
0074         self, db: Session, filters: UserFilter
0075     ) -> Tuple[List[User], int]:
0076         query = db.query(self.model)
0077 
0078         # Filtrar por estado activo/inactivo (None = todos)
0079         if filters.is_active is not None:
0080             query = query.filter(self.model.is_active.is_(filters.is_active))
0081 
0082         if filters.role:
0083             role_enum = self._resolve_role(filters.role)
0084             if role_enum:
0085                 query = query.filter(self.model.account.has(role=role_enum))
0086 
0087         query = self._apply_search_filter(query, filters.search)
0088 
0089         return self._paginate_query(query, filters)
0090 
0091     def get_interns_with_filters(self, db: Session, filters) -> Tuple[List[User], int]:
0092         """
```

## E10 — Registro de errores y token de recuperación

**Fuente:** `BackendFutbol/app/utils/email_client.py` · líneas 160–183.
**SHA-256:** `95f3d3ba9422ce67cc59a5b5fa71fbc2a85d0578629ce85dd922af2662e6c332`

```text
0160 def send_reset_email(to_email: str, full_name: str, reset_token: str) -> None:
0161     """Envía correo con el token de reseteo (o link).
0162 
0163     Args:
0164         to_email: Destinatario del correo.
0165         full_name: Nombre del usuario.
0166         reset_token: Token de restablecimiento que se incluirá en el mensaje.
0167 
0168     Raises:
0169         EmailServiceException: Si el servicio SMTP no está disponible o falla el envío.
0170 
0171     Si la configuración SMTP no está presente, solo se registra el evento.
0172     """
0173     smtp_host, smtp_port, smtp_user, smtp_password, smtp_from, use_ssl = (
0174         _get_smtp_config()
0175     )
0176 
0177     if not smtp_host or not smtp_port or not smtp_from:
0178         logger.warning("SMTP no configurado; se omite envío de reset a %s", to_email)
0179         logger.info("Token de reset para %s: %s", to_email, reset_token)  # útil en dev
0180         return
0181 
0182     frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
0183     reset_link = f"{frontend_base.rstrip('/')}/reset-password?token={reset_token}"
```

**Fuente:** `BackendFutbol/app/core/exception_handlers.py` · líneas 154–181.
**SHA-256:** `ea9caee153e8a5e6025234398b1fd425dd2b01a7f654cf3c999405c2a79bced1`

```text
0154 def database_operational_error_handler(
0155     _request: Request, exc: OperationalError
0156 ) -> JSONResponse:
0157     """Manejador para errores operacionales de base de datos."""
0158     logger.error("Database operational error: %s", exc)
0159     return _service_error_response()
0160 
0161 
0162 def database_interface_error_handler(
0163     _request: Request, exc: InterfaceError
0164 ) -> JSONResponse:
0165     """Manejador para errores de interfaz de base de datos."""
0166     logger.error("Database interface error: %s", exc)
0167     return _service_error_response()
0168 
0169 
0170 def database_error_handler(_request: Request, exc: DatabaseError) -> JSONResponse:
0171     """Manejador para errores generales de base de datos."""
0172     logger.error("Database error: %s", exc)
0173     return _service_error_response()
0174 
0175 
0176 def custom_database_exception_handler(
0177     _request: Request, exc: DatabaseException
0178 ) -> JSONResponse:
0179     """Manejador para excepciones de base de datos personalizadas."""
0180     logger.error("Custom database exception: %s", exc.message)
0181     return _service_error_response()
```

**Fuente:** `BackendFutbol/app/controllers/account_controller.py` · líneas 36–58.
**SHA-256:** `8b2f727b4b3e6d34cf8ba770c9779fcdbf468354e1ab581e272a6ce2ff953448`

```text
0036     def login(self, db: Session, payload: LoginRequest) -> LoginResponse:
0037         """Iniciar sesión y obtener un token de acceso."""
0038         email = payload.email.strip().lower()
0039         account = self.account_dao.get_by_email(db, email, only_active=True)
0040 
0041         if not account:
0042             # Verificamos contra un hash ficticio para igualar tiempos de respuesta
0043             verify_password(payload.password, DUMMY_PASSWORD_HASH)
0044             raise UnauthorizedException("Credenciales inválidas")
0045 
0046         if not verify_password(payload.password, account.password_hash):
0047             raise UnauthorizedException("Credenciales inválidas")
0048 
0049         access_token = self.generate_jwt(account)
0050         refresh_token = create_refresh_token(subject=account.id)
0051 
0052         return LoginResponse(
0053             access_token=access_token,
0054             refresh_token=refresh_token,
0055             token_type="bearer",  # nosec
0056             expires_in=settings.TOKEN_EXPIRES,
0057             refresh_expires_in=settings.REFRESH_TOKEN_EXPIRES,
0058         )
```

## E11 — Excepciones expuestas y manejo global

**Fuente:** `BackendFutbol/app/services/routers/constants.py` · líneas 14–79.
**SHA-256:** `b32c8f1367f06aa5488e8960297f6fc0158f4905893f414535572e8ff4bd49d1`

```text
0014 # ===========================================
0015 UNEXPECTED_ERROR_PREFIX = "Error inesperado"
0016 
0017 
0018 def unexpected_error_message(error: Exception) -> str:
0019     """Genera un mensaje de error inesperado estandarizado.
0020 
0021     Args:
0022         error: La excepción que ocurrió.
0023 
0024     Returns:
0025         Mensaje de error formateado.
0026     """
0027     return f"{UNEXPECTED_ERROR_PREFIX}: {str(error)}"
0028 
0029 
0030 def handle_app_exception(exc: AppException) -> JSONResponse:
0031     """Crea respuesta JSON para AppException.
0032 
0033     Args:
0034         exc: La excepción de aplicación.
0035 
0036     Returns:
0037         JSONResponse con el error formateado.
0038     """
0039     return JSONResponse(
0040         status_code=exc.status_code,
0041         content=ResponseSchema(
0042             status="error",
0043             message=exc.message,
0044             data=None,
0045             errors=None,
0046         ).model_dump(),
0047     )
0048 
0049 
0050 def handle_unexpected_exception(exc: Exception, status_code: int = 500) -> JSONResponse:
0051     """Crea respuesta JSON para excepciones inesperadas.
0052 
0053     Args:
0054         exc: La excepción que ocurrió.
0055         status_code: Código HTTP de respuesta.
0056 
0057     Returns:
0058         JSONResponse con el error formateado.
0059     """
0060     return JSONResponse(
0061         status_code=status_code,
0062         content=ResponseSchema(
0063             status="error",
0064             message=unexpected_error_message(exc),
0065             data=None,
0066             errors=None,
0067         ).model_dump(),
0068     )
0069 
0070 
0071 # ===========================================
0072 # MENSAJES DE RESPUESTA EXITOSA
0073 # ===========================================
0074 SUCCESS_CREATED = "creado correctamente"
0075 SUCCESS_UPDATED = "actualizado correctamente"
0076 SUCCESS_DELETED = "eliminado correctamente"
0077 
0078 # ===========================================
0079 # STATUS STRINGS
```

**Fuente:** `BackendFutbol/app/services/routers/evaluation_router.py` · líneas 180–225.
**SHA-256:** `2e03dac5b65fd6c12b133169fd6f42c9c35e9e69ae160843fb9c047594fc4a0b`

```text
0180             payload=payload,
0181         )
0182 
0183         if not evaluation:
0184             raise HTTPException(status_code=404, detail="Evaluación no encontrada")
0185 
0186         return ResponseSchema(
0187             status="success",
0188             message="Evaluación actualizada correctamente",
0189             data=EvaluationResponseSchema.model_validate(evaluation),
0190         )
0191     except HTTPException:
0192         raise
0193     except DatabaseException as exc:
0194         raise HTTPException(status_code=400, detail=exc.message) from exc
0195     except Exception as exc:
0196         raise HTTPException(status_code=500, detail=str(exc)) from exc
0197 
0198 
0199 @router.delete(
0200     "/{evaluation_id}",
0201     response_model=ResponseSchema,
0202     status_code=status.HTTP_200_OK,
0203     summary="Eliminar evaluación",
0204     description="Elimina (soft delete) una evaluación.",
0205 )
0206 async def delete_evaluation(
0207     evaluation_id: int,
0208     db: Annotated[Session, Depends(get_db)],
0209     current_account: Annotated[Account, Depends(get_current_account)],
0210 ) -> ResponseSchema:
0211     """Eliminar una evaluación."""
0212     try:
0213         deleted = evaluation_controller.delete_evaluation(db, evaluation_id)
0214 
0215         if not deleted:
0216             raise HTTPException(status_code=404, detail="Evaluación no encontrada")
0217 
0218         return ResponseSchema(
0219             status="success",
0220             message="Evaluación eliminada correctamente",
0221         )
0222     except HTTPException:
0223         raise
0224     except Exception as exc:
0225         raise HTTPException(status_code=500, detail=str(exc)) from exc
```

**Fuente:** `BackendFutbol/app/core/exception_handlers.py` · líneas 216–227.
**SHA-256:** `ea9caee153e8a5e6025234398b1fd425dd2b01a7f654cf3c999405c2a79bced1`

```text
0216 def global_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
0217     """Manejador global para excepciones no capturadas."""
0218     logger.error("Unhandled exception: %s: %s", type(exc).__name__, exc)
0219     return JSONResponse(
0220         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
0221         content={
0222             "status": "error",
0223             "message": UNEXPECTED_ERROR_MSG,
0224             "data": None,
0225             "errors": None,
0226         },
0227     )
```

**Fuente:** `BackendFutbol/main.py` · líneas 59–85.
**SHA-256:** `fd05a7d59a4637010c09ecf532eddb3fe730eb75aca2be39854177d744bc1a6e`

```text
0059 async def lifespan(app: FastAPI):
0060     """Eventos de ciclo de vida."""
0061     from app.core.database import SessionLocal
0062     from app.core.seeder import seed_default_admin
0063 
0064     logger.info("🚀 Starting application...")
0065     try:
0066         Base.metadata.create_all(bind=engine)
0067         logger.info("Database tables created")
0068 
0069         # Crear usuario admin por defecto
0070         db = SessionLocal()
0071         try:
0072             seed_default_admin(db)
0073         finally:
0074             db.close()
0075 
0076     except Exception as exc:  # pragma: no cover - se registra el fallo
0077         logger.error(f"Error creating tables or seeding: {exc}")
0078 
0079     logger.info(
0080         f"📊 Scalar Docs: http://{settings.APP_HOST}:{settings.APP_PORT}/scalar"
0081     )
0082     logger.info("✅ Application started")
0083 
0084     yield
0085 
```

## E12 — Autenticación Bearer para evaluación CSRF

**Fuente:** `FrontendFutbol/src/app/config/http.js` · líneas 90–115.
**SHA-256:** `9a16ea8e34d6781d37024d909d5da056939e267522b0c9d9997a0fbb22e5c220`

```text
0090     if (error) {
0091       prom.reject(error);
0092     } else {
0093       prom.resolve(token);
0094     }
0095   });
0096   failedQueue = [];
0097 };
0098 
0099 /**
0100  * Interceptor de REQUEST
0101  * Agrega automáticamente el token de autorización a cada petición
0102  */
0103 http.interceptors.request.use(
0104   (config) => {
0105     const token = localStorage.getItem(AUTH_TOKEN_KEY);
0106 
0107     if (token) {
0108       config.headers.Authorization = `Bearer ${token}`;
0109     }
0110 
0111     return config;
0112   },
0113   (error) => {
0114     console.error("[HTTP Request Error]:", error);
0115     return Promise.reject(error);
```

**Fuente:** `BackendFutbol/app/utils/security.py` · líneas 20–28.
**SHA-256:** `1a0aca8ba30a8590e177be12f90e1120832f5b8fd271568335cfa0f5394750e1`

```text
0020 _pwd_context = CryptContext(
0021     schemes=["bcrypt"],
0022     deprecated="auto",
0023     bcrypt__rounds=10,
0024 )
0025 oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/accounts/login")
0026 
0027 _DB_DEP = Depends(get_db)
0028 _TOKEN_DEP = Depends(oauth2_scheme)
```

## Inventario de dependencias y límites de búsqueda

- `BackendFutbol/uv.lock` · SHA-256 `c84f0ef28b1841a32affc19f9776532878fd3cb3491094de0833c535033592dd`.
- `FrontendFutbol/package-lock.json` · SHA-256 `97fa628d889c376b0310e20aa4983e2ced7185d23f95d74905230c886a9207ea`.
- `BackendFutbol/pyproject.toml` · SHA-256 `00d4600d070ed81d3030ea16416c70473f6acddebc073d905d8e0c2230074daf`.
- `FrontendFutbol/package.json` · SHA-256 `ecac8d2330c360bb7a22a238fee10bee4a7c7e15f817de6009c19cbf152a79e1`.

No se ejecutó SCA ni se descargaron bases de avisos. La existencia de lockfiles no certifica ausencia de vulnerabilidades.

Búsqueda estática adicional en BackendFutbol/app, BackendFutbol/main.py y FrontendFutbol/src: no se localizaron implementaciones con los términos slowapi, limiter, captcha, token_version, blacklist, dangerouslySetInnerHTML o innerHTML. Esta búsqueda complementa la lectura de funciones; la ausencia de coincidencias no demuestra por sí sola ausencia de un control o vulnerabilidad. No se encontró directorio .github/workflows en la copia revisada.

## Fuentes documentales originales

- `APE_Guia_01_Analisis_y_Superficie_de_Ataque_del_Proyecto-signed-signed-firmad (1).docx` · origen: Descargas · SHA-256 `f63e68cf5d7f3afaafff99038ff958b2fe3ecdf385c73f42a4321e085be9d57f`. Conservado sin modificaciones.
- `Manual_Practica_Aula_OWASP_Top10_2025.docx` · origen: Descargas · SHA-256 `419673ac795b62cef24fed8a91cd72dd0eaa8b0561301fa2998e9cc1b381d48d`. Conservado sin modificaciones.
- `Avance_Practica_OWASP_Top10_2025(1).json` · origen: Descargas · SHA-256 `b8049fb6a3f0b1b38bb04bb391d8b677300252e372bd5f85e9da9b4c791d0e1b`. Conservado sin modificaciones.

El contenido textual de la guía se revisó para identificar los avances, instrucciones y conclusiones previas. Las imágenes incrustadas no se reutilizan como demostraciones nuevas ni se transcriben tokens o datos personales.
