import * as filters from "pixi-filters";
import * as PIXIInstance from "pixi.js";
import { PixelRatio } from "react-native";
// https://pixijs.download/v4.8.9/docs/PIXI.Application.html
class PIXIWebApplication extends PIXIInstance.Application {
    constructor({ context, resolution, ...options }) {
        console.log("Running Web PIXI");
        if (!context) {
            throw new Error("PIXI context must be a valid WebGL context.");
        }
        const targetResolution = resolution ?? PixelRatio.get();
        super({
            context,
            resolution: targetResolution,
            ...options,
        });
        this.ticker.add(() => context.endFrameEXP());
    }
}
export const PIXI = {
    ...PIXIInstance,
    filters: {
        ...PIXIInstance.filters,
        ...filters,
    },
    Application: PIXIWebApplication,
};
//# sourceMappingURL=pixi.js.map