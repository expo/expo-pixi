//@flow
import { EventEmitter } from 'fbemitter';
import { vec2 } from 'gl-matrix';

class SignatureBezierProvider extends EventEmitter {
  static dotWeight = 3;
  static pointsPerLine = 4;
  static touchDistanceThreshold = 2;
  static maxWeight = 10;
  static minWeight = 2;

  static paths = ['dot', 'line', 'quadCurve', 'bezierCurve'];

  static EVENT_DRAW_PATH = 'drawPath';

  static signatureWeightForLine(pointA, pointB) {
    /**
     * The is the maximum length that will vary weight.
     * Anything higher will return the same weight.
     */
    const maxLengthRange = SignatureBezierProvider.maxWeight * 10;

    /**
     * These are based on having a minimum line thickness of 2.0 and maximum of 10.0,
     * linearly over line lengths 0-maxLengthRange.
     * They fit into a typical linear equation: y = mx + c
     *
     * Note: Only the points of the two parallel bezier curves will be
     * at least as thick as the constant. The bezier curves themselves
     * could still be drawn with sharp angles, meaning there is no true
     * 'minimum thickness' of the signature.
     */
    const gradient = 0.1;
    const constant = SignatureBezierProvider.minWeight;

    const length = vec2.distance(pointA, pointB);
    const inversedLength = Math.max(maxLengthRange - length, 0);
    return inversedLength * gradient + constant;
  }

  nextPointIndex = 0;
  points = new Array(SignatureBezierProvider.pointsPerLine)
    .fill(SignatureBezierProvider.dotWeight)
    .map(weight => ({ point: vec2.create(), weight }));

  addPointToSignature(point, isEndOfLine = false) {
    if (this.isFirstPoint) {
      this.startNewLine(point, SignatureBezierProvider.dotWeight);
    } else {
      let previousPoint = this.previousPoint;
      if (vec2.length(previousPoint, point) < SignatureBezierProvider.touchDistanceThreshold) {
        return;
      }
      if (this.isStartOfNextLine) {
        this.finalizeBezier(point);
        this.startNewLine(this.points[3].point, this.points[3].weight);
      }

      this.addPointAndWeight(
        point,
        SignatureBezierProvider.signatureWeightForLine(previousPoint, point)
      );
    }

    this.generateBezierPath(this.nextPointIndex - 1, isEndOfLine);
  }

  reset() {
    this.nextPointIndex = 0;
  }

  finalizeBezier(point3rd) {
    /**
     * Smooth the join between beziers by modifying the last point of the current bezier
     * to equal the average of the points either side of it.
     */
    const point2nd = this.points[2].point;
    const pointAvg = this.points[3].point;
    vec2.scale(pointAvg, vec2.add(pointAvg, point2nd, point3rd), 0.5);
    this.points[3].weight = SignatureBezierProvider.signatureWeightForLine(point2nd, pointAvg);

    this.generateBezierPath(3, true);
  }

  generateBezierPath(index, finalized = false) {
    this.emit(
      SignatureBezierProvider.EVENT_DRAW_PATH,
      SignatureBezierProvider.paths[index],
      this.points,
      finalized
    );
  }

  startNewLine(point, weight) {
    this.nextPointIndex = 0;
    this.addPointAndWeight(point, weight);
  }

  addPointAndWeight(point, weight) {
    vec2.copy(this.points[this.nextPointIndex].point, point);
    this.points[this.nextPointIndex].weight = weight;
    this.nextPointIndex += 1;
  }

  get isFirstPoint() {
    return this.nextPointIndex === 0;
  }

  get isStartOfNextLine() {
    return this.nextPointIndex >= SignatureBezierProvider.pointsPerLine;
  }

  get previousPoint() {
    return this.points[this.nextPointIndex - 1].point;
  }
}

export default SignatureBezierProvider;
