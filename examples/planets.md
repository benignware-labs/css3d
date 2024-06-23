# Example: Planets

<!-- Example -->
```css
  @keyframes spin {
    100% {
      rotate: y 360deg;
    }
  }
```

```html
<c3-scene>
  <c3-group
    animation="spin 5s linear infinite"
    style="transform: rotateX(25deg)"
  >
    <c3-sphere
      background="url('./img/luna.jpg')"
      radius="34px"
      position="200px 0 0"
      animation="spin 10s linear infinite"
    ></c3-sphere>
    <c3-sphere
      background="url('./img/earth.jpg')"
      color="#00ff00"
      radius="80px"
      animation="spin 10s linear infinite"
    ></c3-sphere>
  </c3-group>
  </c3-scene>
  ```