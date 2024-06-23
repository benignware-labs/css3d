const SLICES = 32;
const FACETS = 16;

export const sphere = `
  <style scoped>
    :host {
      --radius: 100px;
      --background: gray;
      display: grid;
    }

    .scene {
      width: calc(var(--radius) * 2);
      height: calc(var(--radius) * 2);
      /*transform: translateX(-50%) translateY(-50%) translateZ(calc(var(--radius) * -1));*/
      transform: translate(-50%, -50%);
    }

    :host * {
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }

    .scene,
    .scene *,
    .scene *::before,
    .scene *::after {
      position: absolute;
    }

    .sphere, .slice {
      inset: 0;
    }

    .sphere {
      /* display: grid; */
      transform: scaleX(-1);
    }

    .slice {
      --ngon: 32;
      --angle: calc(360deg/var(--ngon));
      transform: rotateY(calc(var(--angle) * var(--sliceStep))) scaleX(calc(cos(var(--angle) / 2)));
      display: grid;
      place-items: center;
    }

    .facet {
      --facet-width: calc(var(--radius) * 2 * sin(var(--angle) / 2));
      width: var(--facet-width);
      aspect-ratio: 1;
      --ptAngle: calc( atan( (sin(var(--angle)*(var(--ptStep) + 1)) - sin(var(--angle)*var(--ptStep)))/2 ) );
      --peak: calc(-100% * sin(var(--angle)*(var(--facetStep) + 1))/(sin(var(--angle)*(var(--facetStep) + 1)) - sin(var(--angle)*var(--facetStep))) + 100%);
      --clr3: hsl(calc(360deg - 10deg/(var(--ngon)/2)*var(--facetStep)) 100% calc(50% + 38%/(var(--ngon)/2)*var(--facetStep)));  
      --clr4: hsl(calc(360deg - 10deg/(var(--ngon)/2)*(var(--facetStep) + 1)) 100% calc(50% + 38%/(var(--ngon)/2)*(var(--facetStep) + 1)));
      /*background-image: linear-gradient(var(--clr3), var(--clr4)), conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), var(--clr1),var(--clr2) calc(2*var(--ptAngle)), transparent 0);*/
      background-blend-mode: difference;
      webkit-mask-image: conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), black calc(2*var(--ptAngle)), transparent 0);
      mask-image: conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), black calc(2*var(--ptAngle)), transparent 0);
      --pushZ: 52em;
      transform: rotate(calc(90deg + var(--angle)*(.5 + var(--facetStep)))) translateX(calc(var(--pushZ) * cos(var(--angle) / 2))) rotateY(calc(90deg));
      --dir: 1;
      padding-inline: 0;
      background: red;
      background: var(--background);
      background-position: calc(var(--sliceStep) / var(--ngon) * -100%) calc(var(--facetStep) / (var(--ngon) / 2) * 100%);
      background-size: 3200% 1600%;
      backface-visibility: hidden;
    }

    .facet:nth-child(n+9) {
      --dir: -1;
    }

    .slice:nth-child(n-17) .facet:nth-child(n+9),
    .slice:nth-child(n+17) .facet:nth-child(n-9) {
      --clr1: hsl(calc(60deg + 120deg/var(--ngon)*(var(--gradStep) + 1)) 100% calc(50% - 23%/var(--ngon)*(var(--gradStep) + 1)));  
      --clr2: hsl(calc(60deg + 120deg/var(--ngon)*var(--gradStep)) 100% calc(50% - 23%/var(--ngon)*var(--gradStep)));
    }

    :where(.facet),
    .slice:nth-child(n+17) .facet:nth-child(n+9) {
      --clr2: hsl(calc(60deg + 120deg/var(--ngon)*(var(--gradStep) + 1)) 100% calc(50% - 23%/var(--ngon)*(var(--gradStep) + 1)));  
      --clr1: hsl(calc(60deg + 120deg/var(--ngon)*var(--gradStep)) 100% calc(50% - 23%/var(--ngon)*var(--gradStep)));
    }


    .scene .facet {
      --pushZ: var(--radius);
    }

    .scene .facet {
      backface-visibility: hidden;
    }

    /* iterations */

    .slice:nth-child(1) {
      --sliceStep: 0;
    }

    .slice:nth-child(2) {
      --sliceStep: 1;
    }

    .slice:nth-child(3) {
      --sliceStep: 2;
    }

    .slice:nth-child(4) {
      --sliceStep: 3;
    }

    .slice:nth-child(5) {
      --sliceStep: 4;
    }

    .slice:nth-child(6) {
      --sliceStep: 5;
    }

    .slice:nth-child(7) {
      --sliceStep: 6;
    }

    .slice:nth-child(8) {
      --sliceStep: 7;
    }

    .slice:nth-child(9) {
      --sliceStep: 8;
    }

    .slice:nth-child(10) {
      --sliceStep: 9;
    }

    .slice:nth-child(11) {
      --sliceStep: 10;
    }

    .slice:nth-child(12) {
      --sliceStep: 11;
    }

    .slice:nth-child(13) {
      --sliceStep: 12;
    }

    .slice:nth-child(14) {
      --sliceStep: 13;
    }

    .slice:nth-child(15) {
      --sliceStep: 14;
    }

    .slice:nth-child(16) {
      --sliceStep: 15;
    }

    .slice:nth-child(17) {
      --sliceStep: 16;
    }

    .slice:nth-child(18) {
      --sliceStep: 17;
    }

    .slice:nth-child(19) {
      --sliceStep: 18;
    }

    .slice:nth-child(20) {
      --sliceStep: 19;
    }

    .slice:nth-child(21) {
      --sliceStep: 20;
    }

    .slice:nth-child(22) {
      --sliceStep: 21;
    }

    .slice:nth-child(23) {
      --sliceStep: 22;
    }

    .slice:nth-child(24) {
      --sliceStep: 23;
    }

    .slice:nth-child(25) {
      --sliceStep: 24;
    }

    .slice:nth-child(26) {
      --sliceStep: 25;
    }

    .slice:nth-child(27) {
      --sliceStep: 26;
    }

    .slice:nth-child(28) {
      --sliceStep: 27;
    }

    .slice:nth-child(29) {
      --sliceStep: 28;
    }

    .slice:nth-child(30) {
      --sliceStep: 29;
    }

    .slice:nth-child(31) {
      --sliceStep: 30;
    }

    .slice:nth-child(32) {
      --sliceStep: 31;
    }


    /* incrementing the facet's step variable */

    .facet:nth-child(1) {
      --facetStep: 0;
    }

    .facet:nth-child(2) {
      --facetStep: 1;
    }

    .facet:nth-child(3) {
      --facetStep: 2;
    }

    .facet:nth-child(4) {
      --facetStep: 3;
    }

    .facet:nth-child(5) {
      --facetStep: 4;
    }

    .facet:nth-child(6) {
      --facetStep: 5;
    }

    .facet:nth-child(7) {
      --facetStep: 6;
    }

    .facet:nth-child(8) {
      --facetStep: 7;
    }

    .facet:nth-child(9) {
      --facetStep: 8;
    }

    .facet:nth-child(10) {
      --facetStep: 9;
    }

    .facet:nth-child(11) {
      --facetStep: 10;
    }

    .facet:nth-child(12) {
      --facetStep: 11;
    }

    .facet:nth-child(13) {
      --facetStep: 12;
    }

    .facet:nth-child(14) {
      --facetStep: 13;
    }

    .facet:nth-child(15) {
      --facetStep: 14;
    }

    .facet:nth-child(16) {
      --facetStep: 15;
    }

    /* this switches the incrementation and goes backwards at the midpoint */

    .facet:nth-child(1), .facet:nth-last-child(1) {
      --ptStep: 0;
    }

    .facet:nth-child(2), .facet:nth-last-child(2) {
      --ptStep: 1;
    }

    .facet:nth-child(3), .facet:nth-last-child(3) {
      --ptStep: 2;
    }

    .facet:nth-child(4), .facet:nth-last-child(4) {
      --ptStep: 3;
    }

    .facet:nth-child(5), .facet:nth-last-child(5) {
      --ptStep: 4;
    }

    .facet:nth-child(6), .facet:nth-last-child(6) {
      --ptStep: 5;
    }

    .facet:nth-child(7), .facet:nth-last-child(7) {
      --ptStep: 6;
    }

    .facet:nth-child(8), .facet:nth-last-child(8) {
      --ptStep: 7;
    }
  </style>
  <div class="scene">
    <div class="sphere">
      ${[...Array(SLICES)].map((_, i) => `
        <div class="slice" style="--sliceStep: ${i}">
          ${[...Array(FACETS)].map((_, j) => `
            <div class="facet" style="--facetStep: ${j}"></div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </div>
  `;