# Example: Crane

Animated Construction Crane

<!-- Example -->
```css

.texture-crane {
  --color: yellow;
  --tile: 20px;
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


  @keyframes spin {
    100% {
      rotate: y 360deg;
    }
  }

  @keyframes crane {
    0% {
      rotate: y 0deg;
    }
    15% {
      rotate: y -90deg;
    }
    35% {
      rotate: y -90deg;
    }
    50% {
      rotate: y 0deg;
    }
    65% {
      rotate: y 90deg;
    }
    80% {
      rotate: y 90deg;
    }
    100% {
      rotate: y 0;
    }
  }

  @keyframes move {
    0% {
      translate: 0 0 0;
      visibility: hidden;
    }
    20% {
      translate: 0 0 0;
      visibility: hidden;
    }
    30% {
      translate: 0 50px 0;
      visibility: visible;
    }
    70% {
      translate: 0 50px 0;
      visibility: visible;
    }
    80% {
      translate: 0 0 0;
      visibility: hidden;
    }
    100% {
      translate: 0 0 0;
      visibility: hidden;
    }
  }

  @keyframes block1 {
    0% {
      visibility: visible;
      transform: scale3d(0, 0, 0);
    }
    5% {
      visibility: visible;
      transform: scale3d(1, 1, 1);
    }
    20% {
      visibility: hidden;
      transform: scale(1)
    }
    100% {
      visibility: hidden;
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes block2 {
    0% {
      visibility: hidden;
      transform: scale3d(1, 1, 1);
    }
    70% {
      visibility: hidden;
      transform: scale3d(1, 1, 1);
    }
    80% {
      visibility: hidden;
      transform: scale3d(1, 1, 1);
    }
    95% {
      visibility: visible;
      transform: scale3d(1, 1, 1);
    }
    100% {
      visibility: hidden;
      transform: scale3d(0, 0, 0);
    }
  }
```

```html
<c3-scene>
  <c3-group
    animation="spin 10s linear infinite"
  >
  <c3-grid></c3-grid>
  <c3-group>
    <c3-group
      animation="crane 2s linear infinite"
    >
      <c3-box
        class="texture-crane"
        rotate="x 90deg"
        position="0 105px 30px"
        width="20px"
        height="80px"
        depth="20px"
    ></c3-box>
    <c3-box
        class="texture-crane"
        position="0 45px 0"
        width="20px"
        height="100px"
        depth="20px"
        background="url('./img/brick.jpg') repeat 20% 20% / 400px 200px"
      
    ></c3-box>
    <c3-group
      position="0 15px 70px"
      
    >
      <c3-box
        class="box"
        animation="move 2s linear infinite" 
        width="30px"
        height="30px"
        depth="30px"
        background="url('./img/brick.jpg') repeat 50% 50% / 600px 400px"
        
      ></c3-box>
    </c3-group>
    
    </c3-group>
    <c3-group
      position="0 0 0"
    >
      <c3-box
        animation="block1 2s linear infinite"
        class="box"
        position="-70px 15px 0"
        rotate="y -90deg"
        width="30px"
        height="30px"
        depth="30px"
        background="url('./img/brick.jpg') repeat 50% 50% / 600px 400px"
      ></c3-box>

      <c3-box
        animation="block2 2s linear infinite"
        class="box"
        position="70px 15px 0"
        rotate="y 90deg"
        width="30px"
        height="30px"
        depth="30px"
        background="url('./img/brick.jpg') repeat 50% 50% / 600px 400px"
      ></c3-box>
    </c3-group>
  </c3-group>
  </c3-group>
</c3-scene>
```