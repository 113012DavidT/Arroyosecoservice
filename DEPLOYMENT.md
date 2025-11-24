# 🚀 Guía de Despliegue - Arroyo Seco

## 📦 Componentes a desplegar

1. **Frontend** (Angular) → Vercel
2. **Backend** (.NET) → Railway / Render / Azure
3. **Base de Datos** (SQL Server) → Azure SQL / Railway PostgreSQL

---

## 1️⃣ Frontend en Vercel

### Paso 1: Preparar el repositorio
```bash
# Asegúrate de que todo está en Git
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

### Paso 2: Desplegar en Vercel
1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Haz clic en "New Project"
4. Importa el repositorio `arroyoSeco-front`
5. Configuración:
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/arroyo-seco-front/browser`
   - **Install Command**: `npm install`

6. Variables de entorno (añadir después):
   ```
   API_URL=https://tu-backend.railway.app/api
   ```

7. Haz clic en "Deploy"

### Paso 3: Actualizar URL del backend
Después de desplegar el backend, actualiza en:
`src/app/core/services/api.service.ts`
```typescript
readonly baseUrl = 'https://tu-backend-url.com/api';
```

---

## 2️⃣ Backend en Railway

### Opción A: Railway (Recomendado - Fácil)

1. Ve a https://railway.app
2. Inicia sesión con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio del backend
5. Railway detectará automáticamente .NET
6. Variables de entorno necesarias:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=tu-connection-string
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ```

7. Railway asignará una URL pública automáticamente

### Opción B: Render

1. Ve a https://render.com
2. "New" → "Web Service"
3. Conecta tu repositorio del backend
4. Configuración:
   - **Runtime**: Docker o .NET
   - **Build Command**: `dotnet publish -c Release`
   - **Start Command**: `dotnet ./bin/Release/net8.0/publish/TuApp.dll`

### Opción C: Azure App Service (Profesional)

1. Ve a https://portal.azure.com
2. Crea un "App Service"
3. Selecciona:
   - **Runtime stack**: .NET 8
   - **Region**: Cerca de tus usuarios
   - **Pricing**: F1 (Free) o B1 (Basic)

4. Despliegue:
   ```bash
   # Instalar Azure CLI
   # Desde Visual Studio: Click derecho → Publish → Azure
   
   # O desde CLI:
   az login
   az webapp up --name arroyo-seco-api --resource-group mi-grupo
   ```

---

## 3️⃣ Base de Datos

### Opción A: Azure SQL Database (Recomendado para SQL Server)

1. En Azure Portal, crear "SQL Database"
2. Configuración:
   - **Pricing tier**: Basic ($5/mes) o DTU
   - **Servidor**: Crear uno nuevo
   - **Autenticación**: SQL Authentication

3. Obtener connection string:
   ```
   Server=tcp:tu-server.database.windows.net,1433;
   Initial Catalog=arroyoSeco;
   Persist Security Info=False;
   User ID=tu-usuario;
   Password=tu-password;
   MultipleActiveResultSets=False;
   Encrypt=True;
   TrustServerCertificate=False;
   Connection Timeout=30;
   ```

4. Configurar firewall para permitir servicios de Azure

5. Migrar la base de datos:
   ```bash
   # Desde SQL Server Management Studio
   # Click derecho en BD → Tasks → Deploy to Azure SQL Database
   
   # O usar Entity Framework migrations:
   dotnet ef database update --connection "tu-connection-string"
   ```

### Opción B: Railway PostgreSQL (Gratis pero requiere migración)

1. En Railway, "New" → "Database" → "PostgreSQL"
2. Railway provee automáticamente el connection string
3. **Requiere migrar de SQL Server a PostgreSQL**:
   - Cambiar provider en .NET
   - Ajustar queries específicas de SQL Server

---

## 4️⃣ Configuración CORS en Backend

En `Program.cs` del backend, asegúrate de permitir el dominio de Vercel:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "https://tu-app.vercel.app"  // ← Añadir tu dominio de Vercel
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

---

## 5️⃣ Checklist Final

### Frontend:
- [ ] Código en GitHub
- [ ] Proyecto creado en Vercel
- [ ] URL del backend actualizada
- [ ] Despliegue exitoso
- [ ] Probar navegación

### Backend:
- [ ] Código en GitHub
- [ ] Servicio creado (Railway/Render/Azure)
- [ ] Variables de entorno configuradas
- [ ] Connection string configurado
- [ ] CORS configurado con dominio de Vercel
- [ ] API accesible

### Base de Datos:
- [ ] Base de datos creada
- [ ] Firewall configurado
- [ ] Tablas migradas
- [ ] Datos de prueba insertados
- [ ] Connection string probado

---

## 🎯 Recomendación Final

**Setup más simple y económico:**
```
Frontend: Vercel (Gratis)
Backend:  Railway (Gratis con $5 de crédito/mes)
BD:       Railway PostgreSQL (Gratis) o Azure SQL ($5/mes)
```

**Setup más profesional:**
```
Frontend: Vercel (Gratis)
Backend:  Azure App Service ($13/mes aprox)
BD:       Azure SQL Database ($5/mes)
Total:    ~$18/mes
```

---

## 📞 Siguiente Paso

1. Dime qué opción prefieres para el backend y BD
2. Prepararé los archivos de configuración específicos
3. Te guiaré paso a paso en el despliegue
