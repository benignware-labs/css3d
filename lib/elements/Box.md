<!--
  dest: elements/Box.html
-->
# Box

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
  <c3-box
    class="box"
    background="url('../../examples/img/brick.jpg') repeat 50% 50% / 600px 400px"
    animation="spin 3s linear infinite"
    style="transform: rotateX(25deg)"
  ></c3-box>
</c3-scene>
```