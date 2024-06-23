<!--
  dest: elements/Cylinder.html
-->
# Cylinder

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
  <c3-cylinder
    background="url('../../examples/img/brick.jpg') repeat 400px 200px / 600px 400px"
    animation="spin 3s linear infinite"
    style="transform: rotateX(25deg)"
  >
  </c3-cylinder>
</c3-scene>
```
