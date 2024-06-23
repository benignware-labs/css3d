import { EventDispatcher } from '../core/EventDispatcher.mjs';

export class OrbitControls extends EventDispatcher {
  constructor(camera, domElement) {
    super();

    this.camera = camera;
    this.domElement = domElement;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.isDragging = false;
    this.rotation = {
      x: 0,
      y: 0,
    };
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.z = camera.position.z;

    this.init();
  }

  init() {
    // Add event listeners for mouse down, mouse move, mouse up, and wheel events
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('wheel', this.onWheel);
  }

  dispose() {
    // Remove event listeners for mouse down, mouse move, mouse up, and wheel events
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('wheel', this.onWheel);
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  onMouseMove(event) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.mouse.x;
      const deltaY = event.clientY - this.mouse.y;

      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;

      this.rotation.y -= deltaX * 0.5;
      this.rotation.x += deltaY * 0.5;

      const radius = Math.sqrt(this.camera.position.x ** 2 + this.camera.position.y ** 2 + this.camera.position.z ** 2);
      const theta = Math.atan2(this.camera.position.x, this.camera.position.z);
      const phi = Math.acos(this.camera.position.y / radius);

      const deltaTheta = deltaX * -0.01;
      const deltaPhi = deltaY * 0.01;

      const newTheta = theta + deltaTheta;
      const newPhi = Math.max(Math.min(phi - deltaPhi, Math.PI - 0.01), 0.01);

      const x = radius * Math.sin(newPhi) * Math.sin(newTheta);
      const y = radius * Math.cos(newPhi);
      const z = radius * Math.sin(newPhi) * Math.cos(newTheta);

      this.camera.position.set(x, y, z);
      this.camera.lookAt(0, 0, 0);
      this.camera.updateProjectionMatrix();

      this.update();
      
    }
  }

  onMouseUp(event) {
    this.isDragging = false;
  }

  onWheel(event) {
    // Handle wheel event
    const deltaZ = event.deltaY * 0.4;
    
    const direction = this.camera.position.clone().normalize();
    const newPosition = this.camera.position.clone().sub(direction.multiplyScalar(deltaZ));
    const { x, y, z } = newPosition;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  
    this.update();
    // Update positionZ based on wheel delta

    event.preventDefault();
  }

  update() {
    // Update camera rotation and position
    



    // Dispatch a change event
    this.dispatchEvent({ type: 'change' });
  }
}

export default OrbitControls;