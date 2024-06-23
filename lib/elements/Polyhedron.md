<!--
  dest: elements/Polyhedron.html
-->
# Polyhedron

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
  <c3-polyhedron
    background="url('../../examples/img/brick.jpg') repeat 50% 50% / 600px 400px"
    style="transform: rotateX(25deg)"
    animation="spin 3s linear infinite"
  >
    <c3-vertex position="0 -80px 0"></c3-vertex>
    <c3-vertex position="40px 50px 60px"></c3-vertex>
    <c3-vertex position="-70px 0 40px"></c3-vertex>
    <c3-vertex position="0 80px -50px"></c3-vertex>
    <c3-vertex position="90px -80px 0"></c3-vertex>
    <c3-vertex position="-50px 40px -80px"></c3-vertex>
    <c3-vertex position="0 -70px 90px"></c3-vertex>
  </c3-polyhedron>
</c3-scene>
```
