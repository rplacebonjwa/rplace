import argparse
import json
import pathlib
import random

from PIL import Image

WIDTH = 2000
HEIGHT = 1500

colors = {
    0: (0x6D, 0x00, 0x1A, 0xFF),
    1: (0xBE, 0x00, 0x39, 0xFF),
    2: (0xFF, 0x45, 0x00, 0xFF),
    3: (0xFF, 0xA8, 0x00, 0xFF),
    4: (0xFF, 0xD6, 0x35, 0xFF),
    5: (0xFF, 0xF8, 0xB8, 0xFF),
    6: (0x00, 0xA3, 0x68, 0xFF),
    7: (0x00, 0xCC, 0x78, 0xFF),
    8: (0x7E, 0xED, 0x56, 0xFF),
    9: (0x00, 0x75, 0x6F, 0xFF),
    10: (0x00, 0x9E, 0xAA, 0xFF),
    11: (0x00, 0xCC, 0xC0, 0xFF),
    12: (0x24, 0x50, 0xA4, 0xFF),
    13: (0x36, 0x90, 0xEA, 0xFF),
    14: (0x51, 0xE9, 0xF4, 0xFF),
    15: (0x49, 0x3A, 0xC1, 0xFF),
    16: (0x6A, 0x5C, 0xFF, 0xFF),
    17: (0x94, 0xB3, 0xFF, 0xFF),
    18: (0x81, 0x1E, 0x9F, 0xFF),
    19: (0xB4, 0x4A, 0xC0, 0xFF),
    20: (0xE4, 0xAB, 0xFF, 0xFF),
    21: (0xDE, 0x10, 0x7F, 0xFF),
    22: (0xFF, 0x38, 0x81, 0xFF),
    23: (0xFF, 0x99, 0xAA, 0xFF),
    24: (0x6D, 0x48, 0x2F, 0xFF),
    25: (0x9C, 0x69, 0x26, 0xFF),
    26: (0xFF, 0xB4, 0x70, 0xFF),
    27: (0x00, 0x00, 0x00, 0xFF),
    28: (0x51, 0x52, 0x52, 0xFF),
    29: (0x89, 0x8D, 0x90, 0xFF),
    30: (0xD4, 0xD7, 0xD9, 0xFF),
    31: (0xFF, 0xFF, 0xFF, 0xFF),
}


def hex_to_col(hex_str, alpha=0xff):
    assert hex_str[0] == "#" and len(hex_str) == 7

    def conv(s):
        return int(s, 16)

    return (conv(hex_str[1:3]), conv(hex_str[3:5]), conv(hex_str[5:7]))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="*", type=pathlib.Path, default=["pixel.json"])
    args = parser.parse_args()

    img = Image.new("RGBA", (WIDTH, HEIGHT), "#00000000")
    img_overlay = Image.new("RGBA", (WIDTH * 3, HEIGHT * 3), "#00000000")
    img_priority = Image.new("RGBA", (WIDTH, HEIGHT), "#00000000")

    for file in args.files:
        with open(file) as f:
            data = json.loads(f.read())
        for name, part in data["structures"].items():
            print(f"rendering {name}")
            pixels = part["pixels"]
            for pixel in pixels:
                x = pixel["x"]
                y = pixel["y"]
                color_index = pixel["color"]
                priority = pixel["priority"]
                if type(color_index) is str:
                    color = hex_to_col(color_index)
                    print(f"converted {color_index} to {color}")
                else:
                    color = colors[color_index]
                img.putpixel((x, y), color)
                img_overlay.putpixel((x * 3 + 1, y * 3 + 1), color)
                img_priority.putpixel((x, y), (priority, priority, priority))

    img.save("output.png")
    img_overlay.save("overlay.png")
    img_priority.save("priority.png")

    white_pixels = set()
    newPixels = set()
    angriff_color = colors[31]
    angriff_color = colors[27]

    for frame in range(20):
        print(f"render frame {frame}")
        img_overlay = img_overlay.copy()
        newPixels.clear()

        newPixelsToAdd = random.choice(range(2000, 5000)) + len(white_pixels)
        while len(white_pixels) < newPixelsToAdd:
            width = img_overlay.size[0] / 3
            x = random.choice(range(0, WIDTH))
            y = random.choice(range(0, HEIGHT))
            white_pixels.add((x, y))
            newPixels.add((x, y))

        for pixel in newPixels:
            x = pixel[0] * 3
            y = pixel[1] * 3
            img_overlay.putpixel((x + 0, y + 0), angriff_color)
            img_overlay.putpixel((x + 1, y + 0), angriff_color)
            img_overlay.putpixel((x + 2, y + 0), angriff_color)

            img_overlay.putpixel((x + 0, y + 1), angriff_color)
            img_overlay.putpixel((x + 2, y + 1), angriff_color)
            overlayPixel = img_overlay.getpixel((x + 1, y + 1))
            if overlayPixel == (0, 0, 0, 0):
                img_overlay.putpixel((x + 1, y + 1), angriff_color)

            img_overlay.putpixel((x + 0, y + 2), angriff_color)
            img_overlay.putpixel((x + 1, y + 2), angriff_color)
            img_overlay.putpixel((x + 2, y + 2), angriff_color)

        img_overlay.save("angriff_frames/overlay_" + str(frame) + ".png")
