
/**
 * Pasted from definitions file
 */
interface BlobDefinition {
  seed?: Seed,
  radius: number,
  amplitude: number,       // Amplitude of the waves on the blob. Bigger the number, more the blob deviates from a circle.
  noiseLoopRadius: number, // Radius of the loop in 4th dimension. Bigger the number, more distance is covered in the noise domain with each frame.
  frameCount: number,      // Numbers of frames to generate. How many steps is the loop divided into. Bigger the number, less distance is covered in the noise domain with each frame.
}

export default class BlobGenerator {
  protected noiseLoop: NoiseLoop;

  constructor(seed: Seed = Math.random) {
    this.noiseLoop = new NoiseLoop(seed);
  }

  /**
   * Generate an array of points that is later used to create SVG shape
   */
  protected generateBlobShape(blob: BlobDefinition): Shape {
    const points: Array<Point> = [];

    const edgesPerUnit = 0.5;
    const edgeCount = 2 * Math.PI * blob.radius * edgesPerUnit;

    for (let angle = 0; angle <= 2 * Math.PI; angle += 2 * Math.PI / edgeCount) {
      const maxSize = 2 * (blob.radius + blob.amplitude);

      const x = Math.cos(angle);
      const y = Math.sin(angle);

      const noiseComponent = (this.noiseLoop.noise2D(x, y) + 1) / 2;

      points.push({
        x: maxSize / 2 + x * blob.radius + x * noiseComponent * blob.amplitude,
        y: maxSize / 2 + y * blob.radius + y * noiseComponent * blob.amplitude,
      });
    }

    return points;
  }

  /**
   * Generate shape of the blob in every single frame.
   * This creates a perfect loop.
   * 
   * @param blob 
   * @returns Array of "frames", a "frame" is the shape of a blob in a given animation phase
   */
  public generateBlobFrames(blob: BlobDefinition): Array<Shape> {
    const shapes: Array<Shape> = [];

    this.noiseLoop.setLoopRadius(blob.noiseLoopRadius);

    for (let angle = 0, step = 2 * Math.PI / blob.frameCount; angle < 2 * Math.PI; angle += step) {
      this.noiseLoop.setOffsetAngle(angle);
      shapes.push(this.generateBlobShape(blob));
    }

    return shapes;
  }
}

/**
 * Example of how the shape animation is performed
 * It uses svg property animate which allows it to morph without additional javascript
 * 
 * <polygon className="morph" ref={shapeRef}>
 *   <animate attributeName="points" values={blob.frames.join(';')} dur={`${blob.frames.length * blob.frameDuration / 1000}s`} repeatCount="indefinite" />
 * </polygon>
 */
