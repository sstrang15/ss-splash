// colors.js
import { askOpenAI } from "../normalization/openai.js";

const defaultColorway = {
    primary: "#228B22",
    primaryDark: "#145214",
    primaryLight: "#E8F2E8",
    background: "#F4F7F4",
    surface: "#FFFFFF",
    text: "#202820",
    textMuted: "#657265",
    border: "#DCE8DC"
};

const blackColorway = {
    primary: "#141414",
    primaryDark: "#000000",
    primaryLight: "#E8E8E8",
    background: "#EEEEEE",
    surface: "#FFFFFF",
    text: "#111111",
    textMuted: "#626262",
    border: "#CCCCCC"
};

const grayColorway = {
    primary: "#686868",
    primaryDark: "#424242",
    primaryLight: "#EEEEEE",
    background: "#F7F7F7",
    surface: "#FFFFFF",
    text: "#303030",
    textMuted: "#777777",
    border: "#E1E1E1"
};

export async function resolveColor(color) {

    if (!color) return null;

    const result = await askOpenAI(color, [
        "Convert this color name into a representative hexadecimal RGB value.",
        "Preserve specific shades such as Navy, Burgundy, and Forest Green.",
        "Return exactly one six-digit hexadecimal color beginning with #.",
        "Do not include explanations or additional text.",
        "If the input is not a recognizable color, return UNKNOWN."
    ]);

    const hex = result?.trim();
    
    return hex && /^#[0-9a-fA-F]{6}$/.test(hex)
        ? hex.toUpperCase()
        : null;
}

export async function generateColorway(color) {

    const normalized = color.trim().toLowerCase();

    // Special monochromatic treatments

    if (normalized === "white" || normalized === "#ffffff") {
        return defaultColorway;
    }

    if (normalized === "black" || normalized === "#000000") {
        return blackColorway;
    }

    if (
        normalized === "gray" ||
        normalized === "grey" ||
        normalized === "#808080"
    ) {
        return grayColorway;
    }

    // Dynamic colorway generation

    const hex = normalized.replace("#", "");

    if (!/^[0-9a-f]{6}$/.test(hex)) {
        throw new Error(`Invalid hex color: ${color}`);
    }

    return {
        primary: adjustColor(color, 42),
        primaryDark: adjustColor(color, 24),
        primaryLight: adjustColor(color, 91, 0.55),
        background: adjustColor(color, 97, 0.25),
        surface: "#FFFFFF",
        text: "#202020",
        textMuted: "#666666",
        border: adjustColor(color, 85, 0.4)
    };
}

function adjustColor(hex, lightness, saturation = 1) {
    const value = hex.replace("#", "");

    const rgb = [0, 2, 4].map(index =>
        parseInt(value.slice(index, index + 2), 16) / 255
    );

    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const difference = max - min;

    let hue = 0;
    let sat = 0;
    let lum = (max + min) / 2;

    if (difference !== 0) {
        sat = difference / (1 - Math.abs(2 * lum - 1));

        switch (max) {
            case rgb[0]:
                hue = ((rgb[1] - rgb[2]) / difference) % 6;
                break;
            case rgb[1]:
                hue = (rgb[2] - rgb[0]) / difference + 2;
                break;
            default:
                hue = (rgb[0] - rgb[1]) / difference + 4;
        }

        hue = (hue * 60 + 360) % 360;
    }

    sat = Math.min(100, Math.round(sat * saturation * 100));

    return `hsl(${Math.round(hue)}, ${sat}%, ${lightness}%)`;
}