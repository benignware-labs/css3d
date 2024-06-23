# css3d

A set of web components for working with css 3d objects.


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
    background="url('./examples/img/brick.jpg') repeat 200px 200px / 600px 400px"
    animation="spin 5s linear infinite"
  ></c3-box>
</c3-scene>
```
