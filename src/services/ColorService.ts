import { Service } from "typedi";

@Service()
export class ColorService {
  similar(value: number): boolean {
    return value < 15;
  }

  hexToRgb(hex: string): number[] {
    const hexa = hex.substr(1);
    const values = hexa.split("");
    const r = parseInt(values[0].toString() + values[1].toString(), 16);
    const g = parseInt(values[2].toString() + values[3].toString(), 16);
    const b = parseInt(values[4].toString() + values[5].toString(), 16);
    return [r, g, b];
  }

  rgbToLab(rgb: number[]): number[] {
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      x,
      y,
      z;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }

  getDeltaE(hexA: string, hexB: string): number {
    const rgbA = this.hexToRgb(hexA);
    const rgbB = this.hexToRgb(hexB);
    const labA = this.rgbToLab(rgbA);
    const labB = this.rgbToLab(rgbB);
    const deltaL = labA[0] - labB[0];
    const deltaA = labA[1] - labB[1];
    const deltaB = labA[2] - labB[2];
    const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    const deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    const sc = 1.0 + 0.045 * c1;
    const sh = 1.0 + 0.015 * c1;
    const deltaLKlsl = deltaL / 1.0;
    const deltaCkcsc = deltaC / sc;
    const deltaHkhsh = deltaH / sh;
    const i =
      deltaLKlsl * deltaLKlsl +
      deltaCkcsc * deltaCkcsc +
      deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }
}
