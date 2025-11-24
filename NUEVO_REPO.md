# 🔄 Migrar a un nuevo repositorio

## Paso 1: Crear nuevo repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre sugerido: `arroyoSeco-backend-deploy` o `arroyoSeco-api`
3. Descripción: "Backend API para Arroyo Seco - Sistema de gestión turística"
4. **NO inicialices con README, .gitignore ni licencia** (ya los tienes)
5. Click en "Create repository"

---

## Paso 2: Cambiar el remote del repositorio local

Abre PowerShell/Terminal en la carpeta del **BACKEND** y ejecuta:

```powershell
# Ver el remote actual
git remote -v

# Eliminar el remote actual
git remote remove origin

# Agregar el nuevo remote (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/arroyoSeco-backend-deploy.git

# Verificar que cambió
git remote -v

# Hacer push al nuevo repositorio
git push -u origin main
```

Si tu rama principal se llama "master" en lugar de "main":
```powershell
git push -u origin master
```

---

## Paso 3: Verificar que todo subió correctamente

1. Ve a tu nuevo repositorio en GitHub
2. Verifica que aparezcan todos los archivos del backend
3. ✅ Listo para desplegar

---

## ⚠️ IMPORTANTE

- El repositorio VIEJO queda intacto (no se borra nada)
- Ahora tienes una copia limpia en el nuevo repo
- Puedes trabajar en el nuevo sin afectar el viejo
- Si algo sale mal, siempre puedes volver al viejo

---

## 📋 Siguiente paso después de esto:

Una vez que hayas creado el nuevo repo y subido el código, dime y te ayudo a:
1. Desplegarlo en Railway/Azure
2. Configurar las variables de entorno
3. Conectar la base de datos
