import { createNoise4D, NoiseFunction4D } from "simplex-noise";
import { RandomFn } from "simplex-noise/dist/cjs/simplex-noise";

export type Seed = string | number | RandomFn;
export default class NoiseLoop {
  protected noiseGenerator: NoiseFunction4D;

  protected offsetAngle: number;

  protected offsetLoopRadius: number;

  constructor(seed: Seed) {
    this.noiseGenerator = createNoise4D(seed as any);
    this.offsetAngle = 0;
    this.offsetLoopRadius = 20;
  }

  public noise2D(x: number, y: number): number {
    const z = Math.cos(this.offsetAngle) * this.offsetLoopRadius;
    const w = Math.sin(this.offsetAngle) * this.offsetLoopRadius;

    return this.noiseGenerator(x, y, z, w);
  }

  /**
   *  NOTE: In hindsight I don't like this pattern
   *        I would put Angle and Radius as parameters of the noise2D function now
   */
  public setOffsetAngle(angle: number): void {
    this.offsetAngle = angle;
  }

  public setLoopRadius(radius: number): void {
    this.offsetLoopRadius = radius;
  }
}
