import { vec2 } from 'gl-matrix';

const ZERO_VECTOR = vec2.create();

function linePerpendicularToLine(out, vec, middlePoint, weight) {
  if (weight <= 0 || vec2.equals(vec, ZERO_VECTOR)) {
    vec2.copy(out[0], middlePoint);
    vec2.copy(out[1], middlePoint);
  } else {
    const perpendicular = vec2.fromValues(vec[1], -vec[0]);
    vec2.normalize(perpendicular, perpendicular);

    const haflWeight = weight * 0.5;
    vec2.scaleAndAdd(out[0], middlePoint, perpendicular, +haflWeight);
    vec2.scaleAndAdd(out[1], middlePoint, perpendicular, -haflWeight);
  }
  return out;
}

export function lineCreate() {
  return [vec2.create(), vec2.create()];
}

export function lineAverage(out, lineA, lineB) {
  vec2.scale(out[0], vec2.add(out[0], lineA[0], lineB[0]), 0.5);
  vec2.scale(out[1], vec2.add(out[1], lineA[1], lineB[1]), 0.5);
  return out;
}

export function linesPerpendicularToLine(pointA, pointB) {
  const lineVec = vec2.subtract(vec2.create(), pointB.point, pointA.point);

  return {
    first: linePerpendicularToLine(lineCreate(), lineVec, pointA.point, pointA.weight),
    second: linePerpendicularToLine(lineCreate(), lineVec, pointB.point, pointB.weight),
  };
}
