//@flow
import { lineAverage, lineCreate, linesPerpendicularToLine } from './Perpendicular';

type DrawDriver = {
  moveTo: (x: Float, y: Float) => any,
  lineTo: (x: Float, y: Float) => any,
  quadraticCurveTo: (cpX: Float, cpY: Float, toX: Float, toY: Float) => any,
  bezierCurveTo: (cpX: Float, cpY: Float, cpX2: Float, cpY2: Float, toX: Float, toY: Float) => any,
  arc: (
    cx: Float,
    cy: Float,
    radius: Float,
    startAngle: Float,
    endAngle: Float,
    anticlockwise: Bool
  ) => any,
  closePath: () => any,
};

export class BezierPath {
  static dot(points, graphics: DrawDriver) {
    const { point, weight } = points[0];
    graphics.arc(point[0], point[1], weight, 0, Math.PI * 2, true);
  }

  static line(points, graphics: DrawDriver) {
    const { first, second } = linesPerpendicularToLine(points[0], points[1]);
    graphics.moveTo(first[0][0], first[0][1]);
    graphics.lineTo(second[0][0], second[0][1]);
    graphics.lineTo(second[1][0], second[1][1]);
    graphics.lineTo(first[0][0], first[0][1]);
    graphics.closePath();
  }

  static quadCurve(points, graphics: DrawDriver) {
    const linesAB = linesPerpendicularToLine(points[0], points[1]);
    const linesBC = linesPerpendicularToLine(points[1], points[2]);

    const lineA = linesAB.first;
    const lineB = lineAverage(lineCreate(), linesAB.second, linesBC.first);
    const lineC = linesBC.second;

    graphics.moveTo(lineA[0][0], lineA[0][1]);
    graphics.quadraticCurveTo(lineB[0][0], lineB[0][1], lineC[0][0], lineC[0][1]);
    graphics.lineTo(lineC[1][0], lineC[1][1]);
    graphics.quadraticCurveTo(lineB[1][0], lineB[1][1], lineA[1][0], lineA[1][1]);
    graphics.closePath();
  }

  static bezierCurve(points, graphics: DrawDriver) {
    const linesAB = linesPerpendicularToLine(points[0], points[1]);
    const linesBC = linesPerpendicularToLine(points[1], points[2]);
    const linesCD = linesPerpendicularToLine(points[2], points[3]);

    const lineA = linesAB.first;
    const lineB = lineAverage(lineCreate(), linesAB.second, linesBC.first);
    const lineC = lineAverage(lineCreate(), linesBC.second, linesCD.first);
    const lineD = linesCD.second;

    graphics.moveTo(lineA[0][0], lineA[0][1]);
    graphics.bezierCurveTo(
      lineB[0][0],
      lineB[0][1],
      lineC[0][0],
      lineC[0][1],
      lineD[0][0],
      lineD[0][1]
    );
    graphics.lineTo(lineD[1][0], lineD[1][1]);
    graphics.bezierCurveTo(
      lineC[1][0],
      lineC[1][1],
      lineB[1][0],
      lineB[1][1],
      lineA[1][0],
      lineA[1][1]
    );
    graphics.closePath();
  }
}

export default BezierPath;
