export const box = `
  <style scoped>
    :host {
      --width: 200px;
      --height: 200px;
      --depth: 200px;
      --background: rgba(0, 255, 255, 0.6);
    }

    :host .cube {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--width);
      height: var(--height);
      transform-style: preserve-3d;
      transform: translate3d(-50%, -50%, calc(var(--depth) / 2 - var(--width) / 2));
      
    }

    :host .face {
      width: var(--width);
      height: var(--height);
      display: block;
      position: absolute;
      background: var(--background, 'gray');
      /* backface-visibility: hidden; */
      transform-style: preserve-3d;
      /*border: 1px solid red;*/
    }

    /*
    .face {
      position: absolute;
      width: var(--width);
      height: var(--height);
      border: 2px solid black;
      background: var(--background, 'gray');
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }*/
  
    :host .front {
      transform: rotateY( 0deg) translateZ(calc(var(--width) / 2));
      transform-origin: ß 0;
    }

    :host .back {
      transform: rotateX( 180deg) translateZ(calc( var(--depth) - var(--width) / 2 )) ;
    }

    :host .right {
      width: var(--depth);
      transform: rotateY( 90deg) translateX(calc(var(--depth) / 2 - var(--width) / 2)) translateZ(calc( var(--width) - var(--depth) / 2 )) scaleX(-1);
    }

    :host .left {
      width: var(--depth);
      transform: rotateY( -90deg) translateX(calc(var(--width) / 2 - var(--depth) / 2)) translateZ(calc(var(--depth) / 2 ))  scaleX(-1); 
    }

    :host .top {
      height: var(--depth);
      transform: rotateX( 90deg) translateY(calc(var(--width) / 2 - var(--depth) / 2)) translateX(0)  translateZ(calc(var(--depth) / 2)) scaleY(-1);
    }

    :host .bottom {
      height: var(--depth);
      transform: rotateX( -90deg) translateY(calc( var(--depth) / 2 - var(--width) / 2))  translateZ(calc(var(--height) - var(--depth) / 2))  scaleY(-1);
    }
   
    
    
  </style>
  <div class="cube">
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face right"></div>
    <div class="face left"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
`;
