# Example: Textures

You can use css backgrounds as textures. Shape elements have a background property that is passed down as `--background` var.


### Box

<!-- Example -->
```css
@keyframes spin {
  100% {
    rotate: y 360deg;
  }
}

.texture {
  --color: yellow;
  --tile: 100px;
  --stroke: 1px;
  --background: 
  repeating-linear-gradient(
    135deg,
    transparent,
    transparent calc((var( --tile) - var(--stroke) / 2) * sin(135deg)),
    var(--color) calc((var( --tile) - var(--stroke) / 2) * sin(135deg)),
    var(--color) calc((var( --tile) + var(--stroke) / 2) * sin(135deg)),
    transparent calc((var( --tile) + var(--stroke) / 2) * sin(135deg)),
    transparent calc(var( --tile) * 2 * sin(135deg))
  ),
  repeating-linear-gradient(
    -135deg,
    transparent,
    transparent calc((var( --tile) * 2 - var(--stroke)) * sin(135deg)),
    var(--color) calc((var( --tile) * 2 - var(--stroke)) * sin(135deg)),
    var(--color) calc((var( --tile) * 2) * sin(135deg)),
    transparent calc((var( --tile) * 2 + var(--stroke) / 2) * sin(135deg))
  ),
  repeating-linear-gradient(
    90deg,
    var(--color),
    var(--color) calc(var(--stroke) / 2),
    transparent calc(var(--stroke) / 2),
    transparent calc(var(--tile) - var(--stroke) / 2 ),
    var(--color) calc(var(--tile) - var(--stroke) / 2),
    var(--color) calc(var(--tile))
  ),
  repeating-linear-gradient(
    180deg,
    var(--color),
    var(--color) calc(var(--stroke) / 2),
    transparent calc(var(--stroke) / 2),
    transparent calc(var(--tile) - var(--stroke) / 2 ),
    var(--color) calc(var(--tile) - var(--stroke) / 2),
    var(--color) calc(var(--tile))
  );
}
```

```html
<c3-scene>
  <c3-box
    class="texture"
    animation="spin 10s linear infinite"
    width="500px"
    height="100px"
    depth="100px"
  ></c3-box>
</c3-scene>
```