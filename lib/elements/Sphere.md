<!--
  dest: elements/Sphere.html
-->
# Sphere

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
  <c3-sphere
    style="transform: rotateX(25deg)"
    background="url('../../examples/img/brick.jpg') repeat 50% 50% / 600px 400px"
    animation="spin 3s linear infinite"
  ></c3-sphere>
</c3-scene>
```