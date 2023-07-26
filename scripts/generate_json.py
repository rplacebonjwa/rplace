import argparse
import pathlib
import json
import toml
import os
from PIL import Image

COLOR_MAPPINGS = {
	'#6D001A': 0,
	'#BE0039': 1,
	'#FF4500': 2,
	'#FFA800': 3,
	'#FFD635': 4,
	'#FFF8B8': 5,
	'#00A368': 6,
	'#00CC78': 7,
	'#7EED56': 8,
	'#00756F': 9,
	'#009EAA': 10,
	'#00CCC0': 11,
	'#2450A4': 12,
	'#3690EA': 13,
	'#51E9F4': 14,
	'#493AC1': 15,
	'#6A5CFF': 16,
	'#94B3FF': 17,
	'#811E9F': 18,
	'#B44AC0': 19,
	'#E4ABFF': 20,
	'#DE107F': 21,
	'#FF3881': 22,
	'#FF99AA': 23,
	'#6D482F': 24,
	'#9C6926': 25,
	'#FFB470': 26,
	'#000000': 27,
	'#515252': 28,
	'#898D90': 29,
	'#D4D7D9': 30,
	'#FFFFFF': 31
}

def hex_to_col(hex_str, alpha=0xff):
    assert hex_str[0] == "#" and len(hex_str) == 7
    def conv(s):
        return int(s, 16)
    return (conv(hex_str[1:3]), conv(hex_str[3:5]), conv(hex_str[5:7]), alpha)

colors = {}
for hex_str, index in COLOR_MAPPINGS.items():
    colors[hex_to_col(hex_str)] = index

def find_closest_index(color):
    def dist(col1, col2):
        return (col1[0] - col2[0])**2 + (col1[1] - col2[1])**2 + (col1[2] - col2[2])**2
    closest = list(colors.keys())[0]
    val = dist(color, closest)
    for key in colors.keys():
        d = dist(color, key)
        if d < val:
            val = d
            closest = key
    return colors[closest]

def create_structure(image, priority_mask, startx, starty, structure_priority, ignore_colors, used_pixels):
    pixels = []

    def add_pixel(x, y, color, pixel_priority):
        if (x,y) in used_pixels:
            return
        used_pixels.add((x,y))
        pixels.append({
                        "x": x,
                        "y": y,
                        "color": color,
                        "priority": pixel_priority,
                    })

    with Image.open(image) as img:
        priority_img = Image.open(priority_mask) if priority_mask else None
        for x in range(img.size[0]):
            for y in range(img.size[1]):
                color = img.getpixel((x, y))
                if color in ignore_colors:
                    continue
                pixel_priority = priority_img.getpixel((x, y))[0] if priority_img else 128
                add_pixel(startx + x, starty + y, find_closest_index(color), pixel_priority)
        
        if priority_img:
            priority_img.close()

    return {
            "priority": structure_priority,
            "pixels": pixels,
            }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=pathlib.Path, default="config.toml")
    parser.add_argument("output", nargs="?", default="pixel.json")
    args = parser.parse_args()

    # just for easy merge, this will fix the config.toml (can be removed after everyone uses it)
    with open(args.config, "r") as i:
        with open("config.new.toml", "a") as o:
            Lines = i.readlines()
            change = True # just once
            for line in Lines:
                if (not change and
                    line.startswith("# negative of pixel")):
                    change = False
                if (change and
                    line.startswith("[priorities]")):
                    o.write("# negative of pixel in left top corner\n")
                    o.write('[offsets]\n')
                    o.write('"x" = 1000\n')
                    o.write('"y" = 1000\n')
                    o.write('\n')
                nameValue = line.split('=')
                if (change and
                    len(nameValue) == 2 and 
                    (nameValue[0].strip() == "startx" or nameValue[0].strip() == "starty")):
                    line = nameValue[0] + "= " + str(int(nameValue[1]) - 1000) + "\n"
                o.write(line)
    os.remove("config.toml") 
    os.rename('config.new.toml', 'config.toml')

    config = toml.load(args.config)
    ignore_colors = list(map(tuple, config["ignore_colors"]))
    versions = config["versions"]
    offsets = config["offsets"]
    offset_x = offsets["x"]
    offset_y = offsets["y"]

    data = {
        "versions": versions,
        "structures": {},
        "priorities": config["priorities"],
    }

    # Make sure we only place pixels once
    used_pixels = set()
    for struct in reversed(config["structure"]):
        file = struct["file"]
        priority_file = struct.get("priority_file", None)
        name = struct["name"]
        print(f"Adding file {file} for structure {name}")
        data["structures"][name] = create_structure(file, priority_file, struct["startx"] + offset_x, struct["starty"] + offset_y, struct["priority"], ignore_colors, used_pixels)
    
    with open(args.output, "w") as f:
        f.write(json.dumps(data, separators=(',', ':')))
    with open(os.path.splitext(args.output)[0]+"_pretty.json", "w") as f:
        f.write(json.dumps(data, indent=4))
