# Análisis funcional – Sistema de Recepción e Inventario

Documento de análisis técnico y funcional del sistema, sin modificar código.

---

## 1) Flujo funcional  
### Recepción de mercadería e inventario

### Inicio general

**Entrada**  
`App.js` monta `UserProvider` + `CartProvider` y el stack principal `HomeStack`.

**Navegación**  
`homeStack.js` define las pantallas; inicia en `LoginScreen` y luego `HomeScreen`.

**Login**  
- Si no existe base/configuración, redirige a **Configuración**.  
- Si hay sesión guardada, realiza **autologin**.  
Archivos: `LoginScreen.js`.

---

### Menú principal

`HomeScreen` muestra las opciones:
- Sincronizar  
- Comprobantes  
- Enviar pendientes  
- Artículos  
- Configuración  
- Salir  

Archivo: `homeScreen.js`.

---

### Recepción de mercadería (Compras)

**Entrada**  
Home → **Comprobantes** (`ListOrdersScreen`).  
Archivo: `listOrdersScreen.js`.

**Tabs**
- **Recepción de compras** (`tc = RP`)
- **Toma de inventario** (`tc = IR`)

El filtrado se realiza por `tc` en `Order.findAll()` + `filter`.  
Archivos: `listOrdersScreen.js`, `Order.js`.

---

### Nueva recepción

Botón **“Nueva recepción +”** → `NewOrderScreen`.  
En realidad, el stack navega a `CartProviderContainer` → `OrderViewTab`.

- `homeStack.js`
- `CartProviderContainer.js`

---

### Flujo interno (TabView – 3 tabs)

#### PROVEEDOR – `SelectAccountScreen`
- Selección de proveedor
- Clase de precio
- Tipo de comprobante  

Para compras se usa `DropdownTypeDocument` (default `RP`).  
Archivos:
- `SelectAccountScreen.js`
- `DropdownTypeDocument.js`

---

#### ARTÍCULOS – `CartScreen`
- Búsqueda por texto o código
- Escáner de barras
- Modal de cantidad / precio / descuento

Validaciones de stock y duplicados según configuración.  
Archivos:
- `CartScreen.js`
- `ListaProductos.js`
- `ModalCantidad.js`

---

#### RESUMEN – `ResumeCartScreen`
- Totales
- IVA
- Botón **“RECEPCIONAR”** → `useCart.save()`

Guarda en SQLite y opcionalmente comparte / imprime.  
Archivos:
- `ResumeCartScreen.js`
- `useCart.js`

---

### Inventario (Toma de inventario / movimiento de stock)

En `ListOrdersScreen`, tab **“Toma de inventario”** usa `tc = IR` y botón **“Nuevo movimiento +”**.

El flujo y pantallas son idénticos a Recepción, pero usando:
- `StockViewTab`
- `DropdownTypeDocumentStock` (default `IR`)

Archivos:
- `CartStockContainer.js`
- `StockViewTab.js`
- `DropdownTypeDocumentStock.js`

El guardado utiliza la misma lógica `useCart.save()` y tabla `orders`, diferenciadas por `tc`.  
Archivos: `useCart.js`, `Order.js`.

---

### Consulta de stock por artículo

Desde `ProductScreen` → `ProductStockScreen` o `ProductStockScreen2`.

⚠️ `ProductStockScreen2` muestra formulario de “Toma de Inventario” pero **no persiste el ajuste** (solo muestra alert).  
Archivos:
- `productScreen.js`
- `productStockScreen2.js`

---

### Estados relevantes

**useCart**
- `account`
- `cartItems`
- `documentData`
- `orderMode`
- `isEditOrder`
- `isSaving`
- validaciones  

Archivo: `useCart.js`.

**ListOrdersScreen**
- `activeTab`
- `orders`
- `loading`
- `isEmpty`  

Archivo: `listOrdersScreen.js`.

**Edición**
- Tocar comprobante local → `EditOrderScreen`
- Reutiliza `CartProviderContainer`
- Usa `loadEditOrder`  

Archivos:
- `OrderItem.js`
- `homeStack.js`
- `useCart.js`

---

## 2) Backend / API y autenticación

### BaseURL y configuración

- El backend se obtiene desde SQLite tabla `config` (no desde `.env`).
- Configuración editable desde pantalla **Configuración**.

Archivos:
- `api.js`
- `Configuration.js`
- `configurationScreen.js`

⚠️ `config.json` contiene `API_URI` y `API_KEY` pero **no se usa en runtime**.

---

### Autenticación API

- Se usa token **Bearer**.
- `getDataFromAPI` / `setDataToApi` buscan `TOKEN` en `config`.
- Si no existe, ejecutan login.

**Login API**
```text
POST /login
USERNAME_SYNC
PASSWORD_SYNC
ALFA_ACCOUNT
ALFA_DATABASE_ID
