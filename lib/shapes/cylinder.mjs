const FACETS = 16;

export const cylinder = `
  <style scoped>
    :host {
      --radius: 100px;
      --topRadius: 100px;
      --bottomRadius: 100px;
      --height: 200px;
      --facets: ${FACETS};
      --background: rgba(0, 255, 255, 0.1);
    }

    /*
    :host::before,
    :host::after {
      --r: calc(max(var(--topRadius), var(--bottomRadius)));
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: calc(var(--r) * 2);
      height: var(--height);
      transform: translateX(-50%) translateY(-50%) translateZ(calc(var(--r)));
      outline: 2px solid green;
    }

    :host::after {
      transform: translateX(-50%) translateY(-50%) translateZ(calc(-1 * var(--r)));
    }
    */

    .shape {
      --_topRadius: var(--topRadius, var(--radius));
      --_bottomRadius: var(--bottomRadius, var(--radius));
    }

    .shape {
      transform: translate3d(-50%, -50%, calc(var(--radiusTop) / 2));
      transform-style: preserve-3d;
    }

    .top, .bottom, .body {
      transform-style: preserve-3d;
    }

    

    .facet {
      --r: calc((var(--_bottomRadius) + var(--_topRadius)) / 2);
      --angle: calc(var(--facet) * 360deg / var(--facets));
      --x: calc(var(--r) * cos(var(--angle)) - 50%);
      --y: -50%;
      --z: calc(var(--r) * sin(var(--angle)));
      --w2: calc(var(--_topRadius) * 2 * tan(180deg / var(--facets)));
      --w1: calc(var(--_bottomRadius) * 2 * tan(180deg / var(--facets)));

      --w: max(var(--w1), var(--w2));
      --ax: calc(atan2(var(--_bottomRadius) - var(--_topRadius), var(--height)));
      --lx: calc(min(var(--w1), var(--w2)) / 2);
      --h: calc(var(--height) + var(--lx) * sin(ax));
      --s: calc(var(--height) / cos(var(--ax) * -1));
      --a: calc(atan2(var(--s), var(--w2) / 2 - var(--w1) / 2) - 45deg);

      transform-style: preserve-3d;
    }

    .body .facet {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--w);
      height: var(--s);
      transform-origin: 50% 50%;
      transform: translate3d(var(--x), var(--y), var(--z)) rotateY(calc(-1 * var(--angle) + 90deg)) rotateX(calc(var(--ax) * -1));
      
      background: var(--background);
      background-position-x: calc(100% * var(--facet));
      /* background-size: calc(100% * var(--facets)) 100%; */

      --mc: orange;
      --mt: rgba(0, 255, 0, 0.5);
      --mt: transparent; 
     
      mask-image:
        conic-gradient(
          from 135deg at calc( 50% - var(--w1) / 2) 0,
          var(--mt) 45deg,
          var(--mc) 0,
          var(--mc) calc(90deg - var(--a)),
          var(--mt) calc(90deg - var(--a))
        ),

        conic-gradient(
          from 135deg at calc( 50% + var(--w1) / 2) 0,
            var(--mt) calc(var(--a)),
            var(--mc) calc(45deg - var(--a)),
            var(--mc) calc(45deg),
            var(--mt) calc(45deg)
        ),

        conic-gradient(
          from -45deg at calc( 50% - var(--w2) / 2) 100%,
            var(--mt) calc(90deg - var(--a)),
            var(--mc) calc(90deg - var(--a)),
            var(--mc) 45deg,
            var(--mt) 45deg
        ),
        
        conic-gradient(
          from -45deg at calc( 50% + var(--w2) / 2) 100%,
            var(--mt) 45deg,
            var(--mc) 45deg,
            var(--mc) calc(var(--a)),
            var(--mt) calc(var(--a))
        ),
        
        linear-gradient(90deg,
          var(--mt) calc(50% - var(--lx)),
          var(--mc) calc(50% - var(--lx)),
          var(--mc) calc(50% + var(--lx) + 0.5px),
          var(--mt) calc(50% + var(--lx) + 0.5px)
        );
    }

    .top .facet {
      --sx: var(--w2);
      --w: calc(var(--topRadius, var(--radius)) * 2);
      --h: calc(var(--topRadius, var(--radius)) * 2);
    }

    .bottom .facet {
      --sx: var(--w1);
      --w: calc(var(--bottomRadius, var(--radius)) * 2);
      --h: calc(var(--bottomRadius, var(--radius)) * 2);
    }

    .bottom {
      position: absolute;
      top: calc( -1 * var(--height));
    }

    .top .facet,
    .bottom .facet {
      --mc: orange;
      --mt: transparent;
      --r: calc((var(--_bottomRadius) + var(--_topRadius)) / 2);
      --a: calc(atan2(var(--h), var(--sx)));
      --b: calc(atan2(var(--h), var(--sx) * -1));
      --fy: calc(var(--facet) * 0px); 
    }

    .bottom .facet {
      /*transform: translate(-50%, calc(var(--height) / -2 - 50% + var(--fy) )) rotateX(90deg) rotateZ(calc(var(--angle)));*/
    }

    .top .facet::before,
    .bottom .facet::before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(var(--_topRadius) * 2);
      height: calc(var(--_topRadius) * 2);
      background: var(--background);
     
      transform: translate(-50%, -50%) rotateZ(calc(-1 * var(--angle)));
      transform-origin: 50% 50%;
    }

    .bottom .facet::before {
      width: calc(var(--_bottomRadius) * 2);
      height: calc(var(--_bottomRadius) * 2);
      transform: translate(-50%, -50%) rotateZ(calc(-1 * var(--angle))) scaleX(-1);
    }

    .top .facet,
    .bottom .facet {
      background-size: auto 100%;
    }

    .top .facet,
    .bottom .facet {
      position: absolute;
      width: var(--w);
      height: var(--h);
      transform-origin: 50% 50%;
      transform: translate(-50%, calc(var(--height) / 2 - 50% + var(--fy) )) rotateX(90deg) rotateZ(calc(var(--angle)));
      mask-image: conic-gradient(from calc(0deg ) at 50% 50%, var(--mt) var(--a), var(--mc) var(--a), var(--mc) calc(var(--b)), var(--mt) calc(var(--b)));

      outline: 3px solid blue;
    }

    
  </style>
  <div class="shape cylinder">
    <div class="top">
      ${Array.from({length: FACETS}, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join('\n')}
    </div>
    <div class="body">
      ${Array.from({length: FACETS}, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join('\n')}
    </div>
    <div class="bottom">
      ${Array.from({length: FACETS}, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join('\n')}
    </div>
  </div>
  
`;
