# 🎮 Tetris en JavaScript

Juego clásico **Tetris** desarrollado en **JavaScript puro**, utilizando **HTML + CSS** y manipulación directa del DOM (sin canvas ni librerías externas).

---

## 📌 Características

* Tablero de **10 x 20**
* Todas las piezas clásicas (**I, J, L, O, S, T, Z**)
* Rotaciones múltiples por pieza
* Sistema de colisiones
* Eliminación de líneas completas
* Aumento progresivo de velocidad
* Vista previa de la siguiente pieza
* Puntuación clásica estilo Tetris
* Controles por teclado

---

## 🕹️ Controles

| Tecla               | Acción                        |
| ------------------- | ----------------------------- |
| ⬅️ Flecha izquierda | Mover pieza a la izquierda    |
| ➡️ Flecha derecha   | Mover pieza a la derecha      |
| ⬇️ Flecha abajo     | Bajar pieza más rápido        |
| ⬆️ Flecha arriba    | Rotar pieza                   |
| ␣ Espacio           | Caída instantánea (hard drop) |
| ▶️ Botón Start      | Iniciar / Reiniciar partida   |

---

## 🧱 Estructura del Proyecto

```text
📦 tetris-js
 ├── index.html
 ├── style.css
 ├── script.js
 └── README.md
```

---

## ⚙️ Funcionamiento General

### 1️⃣ Creación del tablero

* El tablero se genera dinámicamente creando **200 divs** (10 columnas x 20 filas).
* Cada celda representa un bloque del juego.

### 2️⃣ Piezas (Tetrominós)

* Cada pieza está definida como una **matriz 4x4**.
* Las rotaciones se almacenan como diferentes matrices dentro del objeto `SHAPES`.

### 3️⃣ Lógica de colisión

* Se verifica colisión contra:

  * Bordes laterales
  * Suelo
  * Bloques ya fijados en el grid

### 4️⃣ Fijar pieza

* Cuando una pieza no puede bajar más:

  * Se guarda en el `grid`
  * Se eliminan líneas completas
  * Se genera una nueva pieza

### 5️⃣ Eliminación de líneas

* Se recorren las filas de abajo hacia arriba
* Si una fila está completa:

  * Se elimina
  * Se agrega una fila vacía arriba

### 6️⃣ Puntuación

Sistema clásico:

```js
[0, 40, 100, 300, 1200]
```

* 1 línea → 40 pts
* 2 líneas → 100 pts
* 3 líneas → 300 pts
* 4 líneas → 1200 pts

---

## 🚀 Cómo ejecutar el juego

1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. Presiona **Start**
4. ¡A jugar! 🎉

---

## 🛠️ Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript (ES6)

---

## 📈 Posibles mejoras

* Ghost Piece (sombra de caída)
* Sistema Hold (guardar pieza)
* Sonidos
* Guardado de récords
* Versión Canvas
* Compatibilidad móvil

---

## 📄 Licencia

Proyecto educativo y de práctica. Uso libre.

---

💡 *Desarrollado para aprender lógica de juegos, matrices y manejo del DOM en JavaScript.*


