// colors.js

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


    // Dynamic monochromatic generation

    const hex = normalized.replace("#", "");

    if (!/^[0-9a-f]{6}$/.test(hex)) {
        throw new Error(`Invalid hex color: ${color}`);
    }

    const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${hex}&mode=monochrome&count=8`
    );

    if (!response.ok) {
        throw new Error("Failed to generate colorway");
    }

    const data = await response.json();

    const shades = data.colors.map(color => color.hex.value);

    return {
        primary: shades[5],
        primaryDark: shades[7],
        primaryLight: shades[1],
        background: shades[0],
        surface: "#FFFFFF",
        text: "#202020",
        textMuted: "#666666",
        border: shades[2]
    };
}